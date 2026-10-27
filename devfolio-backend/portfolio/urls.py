
from rest_framework.routers import DefaultRouter
from .views import (
    ProfileViewSet,
    SkillViewSet,
    ExperienceViewSet,
    EducationViewSet,
    ProjectViewSet,
    CategoryViewSet,
    TagViewSet,
    BlogPostViewSet,
    CommentViewSet,
    LikeViewSet,
    ContactMessageViewSet,
)

router = DefaultRouter()

router.register("profile", ProfileViewSet, basename="profile")
router.register("skills", SkillViewSet, basename="skill")
router.register("experiences", ExperienceViewSet, basename="experience")
router.register("education", EducationViewSet, basename="education")
router.register("projects", ProjectViewSet, basename="project")
router.register("categories", CategoryViewSet, basename="category")
router.register("tags", TagViewSet, basename="tag")
router.register("posts", BlogPostViewSet, basename="post")
router.register("comments", CommentViewSet, basename="comment")
router.register("likes", LikeViewSet, basename="like")
router.register(
    "contact-messages",
    ContactMessageViewSet,
    basename="contact-message",
)

urlpatterns = router.urls
