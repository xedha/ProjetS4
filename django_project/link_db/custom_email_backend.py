# custom_email_backend.py
# Place this file in your Django app directory (e.g., link_db/custom_email_backend.py)

import ssl
import smtplib
from django.core.mail.backends.smtp import EmailBackend
from django.core.mail.message import sanitize_address


class UnverifiedSSLEmailBackend(EmailBackend):
    """
    Custom email backend that bypasses SSL certificate verification.
    Use this for development or when dealing with certificate issues.
    """
    
    def open(self):
        """
        Ensure an open connection to the email server. Return whether or not a
        new connection was required (True or False).
        """
        if self.connection:
            # Nothing to do if the connection is already open.
            return False
        
        # If using TLS, we need to bypass SSL verification
        connection_params = {}
        if self.timeout is not None:
            connection_params['timeout'] = self.timeout
        
        try:
            self.connection = smtplib.SMTP(self.host, self.port, **connection_params)
            
            # Create unverified SSL context
            if self.use_tls:
                context = ssl.create_default_context()
                context.check_hostname = False
                context.verify_mode = ssl.CERT_NONE
                self.connection.starttls(context=context)
            
            if self.username and self.password:
                self.connection.login(self.username, self.password)
            
            return True
            
        except (smtplib.SMTPException, OSError):
            if not self.fail_silently:
                raise