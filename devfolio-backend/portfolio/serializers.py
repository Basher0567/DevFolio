
from rest_framework import serializers
from .models import (
    Profile, Skill, Experience, Education, Project,
    Category, Tag, BlogPost, Comment, Like, ContactMessage,
)


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = "__all__"


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = "__all__"
        extra_kwargs = {
            "proficiency": {"min_value": 0, "max_value": 100}
        }


class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = "__all__"

    def validate(self, data):
        start = data.get(
            "start_date",
            getattr(self.instance, "start_date", None),
        )
        end = data.get(
            "end_date",
            getattr(self.instance, "end_date", None),
        )

        if end and start and end < start:
            raise serializers.ValidationError(
                "End date cannot be before start date."
            )

        return data


class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = "__all__"


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = "__all__"


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = "__all__"


class BlogPostSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(
        source="category.name", read_only=True
    )
    tags_detail = TagSerializer(
        source="tags", many=True, read_only=True
    )
    like_count = serializers.IntegerField(read_only=True)
    comment_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = BlogPost
        fields = [
            "id", "title", "slug", "excerpt", "content",
            "cover_image", "category", "category_name",
            "tags", "tags_detail", "status", "published_at",
            "created_at", "updated_at",
            "like_count", "comment_count",
        ]
        read_only_fields = [
            "slug", "created_at", "updated_at",
            "like_count", "comment_count",
        ]


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = [
            "id", "post", "name", "email", "content",
            "is_approved", "created_at",
        ]
        read_only_fields = ["is_approved", "created_at"]


class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ["id", "post", "visitor_key", "created_at"]
        read_only_fields = ["created_at"]


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = [
            "id", "name", "email", "subject",
            "message", "is_read", "created_at",
        ]
        read_only_fields = ["is_read", "created_at"]


from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.exceptions import AuthenticationFailed


class OwnerTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["is_owner"] = user.is_superuser
        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        if not self.user.is_active or not self.user.is_superuser:
            raise AuthenticationFailed(
                "Only the portfolio owner can log in."
            )

        return data

