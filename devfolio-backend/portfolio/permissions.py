
from rest_framework.permissions import BasePermission, SAFE_METHODS


class OwnerOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True

        user = request.user
        return bool(
            user
            and user.is_authenticated
            and user.is_active
            and user.is_superuser
        )


class PublicReadCreateOwnerManage(BasePermission):
    def has_permission(self, request, view):
        user = request.user

        # Only the Owner can approve or manage existing comments.
        if getattr(view, "action", None) == "approve":
            return bool(
                user
                and user.is_authenticated
                and user.is_active
                and user.is_superuser
            )

        if request.method in SAFE_METHODS or request.method == "POST":
            return True

        return bool(
            user
            and user.is_authenticated
            and user.is_active
            and user.is_superuser
        )


class PublicCreateOwnerManage(BasePermission):
    def has_permission(self, request, view):
        if request.method == "POST":
            return True

        user = request.user
        return bool(
            user
            and user.is_authenticated
            and user.is_active
            and user.is_superuser
        )

