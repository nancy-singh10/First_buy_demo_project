from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import Notification
from .serializers import NotificationSerializer


class NotificationListView(generics.ListAPIView):
    """Return all notifications for the logged-in user, newest first."""
    serializer_class   = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)


@api_view(['PATCH'])
@permission_classes([permissions.IsAuthenticated])
def mark_all_read(request):
    """Mark every unread notification as read for the logged-in user."""
    Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
    return Response({'status': 'all marked as read'})


@api_view(['PATCH'])
@permission_classes([permissions.IsAuthenticated])
def mark_one_read(request, pk):
    """Mark a single notification as read."""
    try:
        notif = Notification.objects.get(pk=pk, user=request.user)
        notif.is_read = True
        notif.save()
        return Response({'status': 'marked as read'})
    except Notification.DoesNotExist:
        return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
