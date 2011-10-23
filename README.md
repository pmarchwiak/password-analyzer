Password Analyzer 0.1 by Patrick Marchwiak <pd@marchwiak.com>

Project description:

One of the biggest headaches in personal computing today is the
management of passwords. Almost every online service requires the
creation of an account with a unique password. Most moderate internet
users have tens if not hundreds of accounts. As far as I know, there
is no easy way to analyze and change these passwords en masse.

My idea is the creation of a Firefox extension that would help users
to analyze their existing saved passwords for security. Various
techniques could be used to determine how risky a password is
including checking for common words, short lengths, personal
information (obtained from saved form info), and similarity to other
saved passwords. If time allots, I will also attempt to provide an
automated method for changing passwords both in the saved passwords
database and external sites. Heuristics could potentially be developed
to find a website's change password dialog and fill it in with an
existing password and a desired new password automatically.
Alternatively a database of popular website change password pages
could be developed.

There do exist a number of tools that have some overlap with this idea
and I hope to use them for inspiration. Password management tools such
as LastPass take care of generation of and storage of passwords but
require a user's trust of a third-party. There are also Firefox
extensions like BadPass which analyzes passwords typed into form
fields and Mass Password Reset, which allows the changing of many
passwords at once.  
