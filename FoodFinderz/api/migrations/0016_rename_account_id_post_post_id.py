# Generated by Django 4.1 on 2023-06-27 23:10

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0015_post_account_id'),
    ]

    operations = [
        migrations.RenameField(
            model_name='post',
            old_name='account_id',
            new_name='post_id',
        ),
    ]
