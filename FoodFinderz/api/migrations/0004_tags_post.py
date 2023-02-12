# Generated by Django 4.1 on 2023-02-12 01:52

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Tags',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tag', models.CharField(default='', max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='Post',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(default='', max_length=50)),
                ('food', models.CharField(default='', max_length=50)),
                ('current_session', models.CharField(default='', max_length=50)),
                ('description', models.CharField(default='', max_length=2000)),
                ('account_poster', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.account')),
                ('tags', models.ManyToManyField(to='api.tags')),
            ],
        ),
    ]
