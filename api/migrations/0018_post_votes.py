# Generated by Django 4.1 on 2023-07-02 21:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0017_account_downvoted_posts_account_upvoted_posts_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='votes',
            field=models.IntegerField(default=0),
        ),
    ]
