"""Sundry utility functions"""
import re
import unidecode
import inspect
from time import sleep
from StringIO import StringIO

from pyramid.settings import asbool
from pyramid.security import Everyone
from pyramid.i18n import negotiate_locale_name
from urlparse import urlparse
from bs4 import UnicodeDammit

from . import config
from assembl.lib.locale import strip_country


def get_eol(text):
    """Return the EOL character sequence used in the text."""
    line = StringIO(text).readline()
    return line[len(line.rstrip('\r\n')):]


def slugify(str):
    str = unidecode.unidecode(str).lower()
    return re.sub(r'\W+', '-', str)


def get_subclasses_recursive(c):
    """Recursively returns the classes is a class hierarchy"""
    subclasses = c.__subclasses__()
    for d in list(subclasses):
        subclasses.extend(get_subclasses_recursive(d))
    return subclasses


def get_concrete_subclasses_recursive(c):
    """Recursively returns only the concrete classes is a class hierarchy"""
    concreteSubclasses = []
    subclasses = get_subclasses_recursive(c)
    for d in subclasses:
        if not inspect.isabstract(d):
            concreteSubclasses.append(d)
    return concreteSubclasses


def get_global_base_url(require_secure=None, override_port=None):
    """Get the base URL of this server
    DO NOT USE directly, except for Linked data;
    use Discussion.get_base_url()
    """
    port = str(override_port or config.get('public_port'))
    accept_secure_connection = asbool(
        config.get('accept_secure_connection'))
    require_secure_connection = accept_secure_connection and (
        require_secure or
        asbool(config.get('require_secure_connection')) or
        asbool(config.get('secure_proxy')))
    service = 'http'
    portString = ''
    if accept_secure_connection or require_secure_connection:
        if port is None or port == "443":
            service += 's'
        elif port == "80":
            if require_secure_connection:
                service += 's'  # assume standard port upgrade
                port = "443"
        else:
            if require_secure_connection:
                service += 's'
            portString = (':'+port)
    else:
        if port is not None and port != "80":
            portString = (':'+port)
    return '%s://%s%s' % (
        service, config.get('public_hostname'), portString)


def is_url_from_same_server(url, discussion=None):
    if not url:
        return False
    if discussion:
        base = urlparse(discussion.get_base_url())
    else:
        # TODO: If future virtual hosting allowed, using this
        # is very, very bad. Need to get the virtual host
        # address instead
        base = urlparse(get_global_base_url())
    purl = urlparse(url)
    return base.hostname == purl.hostname and base.port == purl.port


def path_qs(url):
    """Returns all components of url, including qs after hostname:port
    excluding the dangling "/"

    eg. url := "https://abcd.com:6543/a/b/c?foo=bar&baz=whocares"
    returns '/a/b/c?foo=bar&baz=whocares'
    """
    p = urlparse(url)
    return p.path + "?" + p.params


def full_class_name(cls):
    if not isinstance(cls, type):
        cls = cls.__class__
    return ".".join((cls.__module__, cls.__name__))


def waiting_get(cls, id, lock=False):
    # Waiting for an object to be flushed on another thread
    wait_time = 0.02
    # This amounts to ~5 seconds total, in 12 increasing steps
    q = cls.default_db.query(cls).filter_by(id=id)
    if lock:
        q = q.with_lockmode('update')
    while wait_time < 2:
        objectInstance = q.first()
        if objectInstance is not None:
            return objectInstance
        sleep(wait_time)
        wait_time *= 1.5


def normalize_email_name(name):
    name = UnicodeDammit(name).unicode_markup
    # sanitize, keep only words, spaces and minimal punctuation
    # includes unicode apostrophes, though.
    name = re.sub(
        ur"[^-\w\s'\u2019\u2032\u00b4\.\(\)]", '', name, 0, re.UNICODE)
    return name


def snake_to_camel(string):
    # https://stackoverflow.com/questions/19053707/converting-snake-case-to-lower-camel-case-lowercamelcase
    components = string.split('_')
    # We capitalize the first letter of each component except the first one
    # with the 'title' method and join them together.
    return components[0] + "".join(x.title() for x in components[1:])


def process_locale_from_request(request):
    from assembl.models.auth import LanguagePreferenceOrder
    if '_LOCALE_' in request.params:
        locale = request.params['_LOCALE_']
        return (locale, LanguagePreferenceOrder.Parameter)
    elif '_LOCALE_' in request.cookies:
        locale = request.cookies['_LOCALE_']
        return (locale, LanguagePreferenceOrder.Cookie)
    else:
        # uses my locale negotiator
        locale = negotiate_locale_name(request)
        return (locale, LanguagePreferenceOrder.OS_Default)


def get_locale_from_request(request, session=None, user=None):
    from assembl.models.auth import User, UserLanguagePreferenceCollection
    from assembl.models.langstrings import Locale
    if user is None:
        user_id = request.authenticated_userid or Everyone
        if user_id != Everyone:
            user = User.get(user_id)
    session = session or User.default_db
    if user:
        locale, level = process_locale_from_request(request)
        discussion_id = request.matchdict['discussion_id'] if (request.matchdict and 'discussion_id' in request.matchdict) else None
        language_preferences = UserLanguagePreferenceCollection(user.id, discussion_id=discussion_id, session=session)
        language_preferences.process_locale(locale, level)
    else:
        locale = request.localizer.locale_name
    target_locale = Locale.get_or_create(
        strip_country(locale), session)
    return target_locale
