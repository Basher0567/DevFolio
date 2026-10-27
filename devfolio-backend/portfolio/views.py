# from django.shortcuts import render

from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
#from django.db.models import Count, Q
from rest_framework.decorators import action

from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import OwnerTokenObtainPairSerializer

from django.db.models import Count,Q
from django.utils import timezone
from .permissions import (
    OwnerOrReadOnly,
    PublicCreateOwnerManage,
    PublicReadCreateOwnerManage,
)

from .models import (
    Profile,
    Skill,
    Experience,
    Education,
    Project,
    Category,
    Tag,
    BlogPost,
    Comment,
    Like,
    ContactMessage,
)
from .serializers import (
    ProfileSerializer,
    SkillSerializer,
    ExperienceSerializer,
    EducationSerializer,
    ProjectSerializer,
    CategorySerializer,
    TagSerializer,
    BlogPostSerializer,
    CommentSerializer,
    LikeSerializer,
    ContactMessageSerializer,
)
from .permissions import OwnerOrReadOnly, PublicCreateOwnerManage


class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [OwnerOrReadOnly]


class SkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [OwnerOrReadOnly]
    filterset_fields = ["category"]
    search_fields = ["name", "category"]
    ordering_fields = ["name", "proficiency", "display_order"]


class ExperienceViewSet(viewsets.ModelViewSet):
    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer
    permission_classes = [OwnerOrReadOnly]
    search_fields = ["company", "position", "description"]
    ordering_fields = ["start_date", "company"]


class EducationViewSet(viewsets.ModelViewSet):
    queryset = Education.objects.all()
    serializer_class = EducationSerializer
    permission_classes = [OwnerOrReadOnly]
    search_fields = ["institution", "degree", "field_of_study"]
    ordering_fields = ["start_date", "institution"]


class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [OwnerOrReadOnly]
    lookup_field = "slug"
    filterset_fields = ["is_featured"]
    search_fields = ["title", "description", "technologies"]
    ordering_fields = ["title", "created_at"]

    def get_queryset(self):
        queryset = Project.objects.all()       
        if (    self.request.user.is_authenticated and self.request.user.is_superuser):
            return queryset
        return queryset.filter(is_published=True)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [OwnerOrReadOnly]
    lookup_field = "slug"
    search_fields = ["name"]


class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [OwnerOrReadOnly]
    lookup_field = "slug"
    search_fields = ["name"]


class BlogPostViewSet(viewsets.ModelViewSet):
    serializer_class = BlogPostSerializer
    permission_classes = [OwnerOrReadOnly]
    lookup_field = "slug"
    filterset_fields = ["category__slug", "tags__slug"]
    search_fields = ["title", "excerpt", "content"]
    ordering_fields = ["published_at", "created_at", "title"]

    def get_queryset(self):
        queryset = BlogPost.objects.select_related("category").prefetch_related("tags")

        queryset = queryset.annotate(
            like_count=Count("likes", distinct=True),
            comment_count=Count(
                "comments",
                filter=Q(comments__is_approved=True),
                distinct=True,
            ),
        )

        if self.request.user.is_authenticated and self.request.user.is_staff:
            return queryset

        return queryset.filter(
            status="published",
            published_at__lte=timezone.now(),
        )


class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [PublicReadCreateOwnerManage]
    http_method_names = ["get", "post", "delete", "head", "options"]
    filterset_fields = ["post__slug"]

    def get_queryset(self):
        queryset = Comment.objects.select_related("post")
        if self.request.user.is_authenticated and self.request.user.is_staff:
            return queryset
        return queryset.filter(
            is_approved=True,
            post__status="published",
            post__published_at__lte=timezone.now(),
        )

    def perform_create(self, serializer):
        # Approval must always be done by the owner.
        serializer.save(is_approved=False)
    
    @action(detail=True, methods=["post"], url_path="approve")
    def approve(self, request, pk=None):
        comment = self.get_object()
        comment.is_approved = True
        comment.save(update_fields=["is_approved"])

        return Response({
            "message": "Comment approved successfully.",
            "id": comment.id,
            "is_approved": comment.is_approved,
        })


class LikeViewSet(viewsets.ModelViewSet):
    serializer_class = LikeSerializer
    permission_classes = [PublicCreateOwnerManage]
    http_method_names = ["get", "post", "delete", "head", "options"]

    def get_queryset(self):
        queryset = Like.objects.select_related("post")
        if self.request.user.is_authenticated and self.request.user.is_staff:
            return queryset
        return queryset.filter(
            post__status="published",
            post__published_at__lte=timezone.now(),
        )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        post = serializer.validated_data["post"]
        visitor_key = serializer.validated_data["visitor_key"]

        if (
            post.status != "published"
            or not post.published_at
            or post.published_at > timezone.now()
        ):
            return Response(
                {"detail": "This post is not available for liking."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        like, created = Like.objects.get_or_create(
            post=post,
            visitor_key=visitor_key,
        )

        return Response(
            LikeSerializer(like).data,
            status=(status.HTTP_201_CREATED if created else status.HTTP_200_OK),
        )


class ContactMessageViewSet(viewsets.ModelViewSet):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [PublicCreateOwnerManage]
    http_method_names = ["get", "post", "delete", "head", "options"]


class OwnerTokenObtainPairView(TokenObtainPairView):
    serializer_class = OwnerTokenObtainPairSerializer

