from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.utils import timezone
from .models import FamilyPool, FamilyPoolInvitation
from .serializers import (
    FamilyPoolSerializer,
    FamilyPoolCreateSerializer,
    FamilyPoolInvitationSerializer,
    InviteMemberSerializer,
    FamilyMemberCreditActivitySerializer,
)
from credits.models import CreditTransaction

User = get_user_model()


class FamilyPoolDetailView(APIView):
    """GET — return the current user's family pool (or 404 if none)."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        pool = FamilyPool.objects.filter(members=request.user).first()
        if not pool:
            return Response({'detail': 'You are not in a family pool.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = FamilyPoolSerializer(pool)
        return Response(serializer.data)


class FamilyPoolCreateView(APIView):
    """POST — create a new family pool."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = FamilyPoolCreateSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        pool = serializer.save()
        return Response(FamilyPoolSerializer(pool).data, status=status.HTTP_201_CREATED)


class InviteMemberView(APIView):
    """POST — invite a user by email to the caller's pool."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        pool = FamilyPool.objects.filter(members=request.user).first()
        if not pool:
            return Response({'detail': 'You must be in a family pool to send invitations.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = InviteMemberSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']

        # Check for existing pending invitation
        if FamilyPoolInvitation.objects.filter(pool=pool, invited_email=email, status='pending').exists():
            return Response({'detail': 'An invitation is already pending for this email.'}, status=status.HTTP_400_BAD_REQUEST)

        invitation = FamilyPoolInvitation.objects.create(
            pool=pool,
            invited_by=request.user,
            invited_email=email
        )
        return Response(FamilyPoolInvitationSerializer(invitation).data, status=status.HTTP_201_CREATED)


class PendingInvitationsView(APIView):
    """GET — list pending invitations for the current user."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        invitations = FamilyPoolInvitation.objects.filter(
            invited_email__iexact=request.user.email,
            status='pending'
        )
        serializer = FamilyPoolInvitationSerializer(invitations, many=True)
        return Response(serializer.data)


class AcceptInvitationView(APIView):
    """POST — accept an invitation."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            invitation = FamilyPoolInvitation.objects.get(
                pk=pk,
                invited_email__iexact=request.user.email,
                status='pending'
            )
        except FamilyPoolInvitation.DoesNotExist:
            return Response({'detail': 'Invitation not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Check if user is already in a pool
        if FamilyPool.objects.filter(members=request.user).exists():
            return Response({'detail': 'You are already in a family pool. Leave it first.'}, status=status.HTTP_400_BAD_REQUEST)

        invitation.status = 'accepted'
        invitation.responded_at = timezone.now()
        invitation.save()

        # Add user to the pool
        invitation.pool.members.add(request.user)

        return Response({'detail': 'Invitation accepted! You are now part of the family pool.'})


class DeclineInvitationView(APIView):
    """POST — decline an invitation."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            invitation = FamilyPoolInvitation.objects.get(
                pk=pk,
                invited_email__iexact=request.user.email,
                status='pending'
            )
        except FamilyPoolInvitation.DoesNotExist:
            return Response({'detail': 'Invitation not found.'}, status=status.HTTP_404_NOT_FOUND)

        invitation.status = 'declined'
        invitation.responded_at = timezone.now()
        invitation.save()
        return Response({'detail': 'Invitation declined.'})


class FamilyPoolActivityView(APIView):
    """GET — credit activity for all pool members."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        pool = FamilyPool.objects.filter(members=request.user).first()
        if not pool:
            return Response({'detail': 'You are not in a family pool.'}, status=status.HTTP_404_NOT_FOUND)

        member_ids = pool.members.values_list('id', flat=True)
        transactions = CreditTransaction.objects.filter(
            user_id__in=member_ids
        ).select_related('user').order_by('-created_at')[:50]

        serializer = FamilyMemberCreditActivitySerializer(transactions, many=True)
        return Response(serializer.data)


class LeavePoolView(APIView):
    """POST — leave the current family pool."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        pool = FamilyPool.objects.filter(members=request.user).first()
        if not pool:
            return Response({'detail': 'You are not in a family pool.'}, status=status.HTTP_404_NOT_FOUND)

        if pool.owner == request.user:
            # If owner leaves, disband the pool entirely
            pool.delete()
            return Response({'detail': 'You were the owner. The family pool has been disbanded.'})

        pool.members.remove(request.user)
        return Response({'detail': 'You have left the family pool.'})


class RemoveMemberView(APIView):
    """POST — owner removes a member from the pool."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, user_id):
        pool = FamilyPool.objects.filter(owner=request.user).first()
        if not pool:
            return Response({'detail': 'Only the pool owner can remove members.'}, status=status.HTTP_403_FORBIDDEN)

        if user_id == request.user.id:
            return Response({'detail': 'You cannot remove yourself. Use the leave endpoint instead.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            member = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        if not pool.members.filter(pk=user_id).exists():
            return Response({'detail': 'This user is not a member of your pool.'}, status=status.HTTP_400_BAD_REQUEST)

        pool.members.remove(member)
        return Response({'detail': f'{member.full_name} has been removed from the pool.'})
