import pymysql
pymysql.install_as_MySQLdb()
from django.apps import AppConfig

AppConfig.default = False