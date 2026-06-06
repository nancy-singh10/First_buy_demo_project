from django.urls import path
from .views import (
    FamilyPoolDetailView,
    FamilyPoolCreateView,
    InviteMemberView,
    PendingInvitationsView,
    AcceptInvitationView,
    DeclineInvitationView,
    FamilyPoolActivityView,
    LeavePoolView,
    RemoveMemberView,
)

urlpatterns = [
    path('', FamilyPoolDetailView.as_view(), name='familypool-detail'),
    path('create/', FamilyPoolCreateView.as_view(), name='familypool-create'),
    path('invite/', InviteMemberView.as_view(), name='familypool-invite'),
    path('invitations/', PendingInvitationsView.as_view(), name='familypool-invitations'),
    path('invitations/<int:pk>/accept/', AcceptInvitationView.as_view(), name='familypool-accept'),
    path('invitations/<int:pk>/decline/', DeclineInvitationView.as_view(), name='familypool-decline'),
    path('activity/', FamilyPoolActivityView.as_view(), name='familypool-activity'),
    path('leave/', LeavePoolView.as_view(), name='familypool-leave'),
    path('remove/<int:user_id>/', RemoveMemberView.as_view(), name='familypool-remove'),
]
