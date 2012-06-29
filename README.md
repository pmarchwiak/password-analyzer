Password Analyzer
================
 
Version 0.2

by Patrick Marchwiak <pd@marchwiak.com>

INTRODUCTION
---------------
One of the biggest headaches for users of the internet today is the management 
of passwords. The vast majority of online service requires the creation of an
account with a password. Most moderate internet users have tens if not hundreds
of different accounts. Password Analyzer is a tool that can be used to analyze
 the strength of passwords stored in a user’s Firefox saved
password database.

USAGE
--------
Password Analyzer is implemented as a Firefox add-on. After the add-on is 
installed, the user must click the widget in the add-on bar at the bottom of 
the browser window. Once the widget is clicked the Password Analyzer window will
open. Clicking the “Analyze” button will run the strength analysis algorithms
across the user’s saved passwords and display the results. Results are displayed
in a table with each row representing a single website / account sorted by
increasing password strength. For each website the URL, username, and password
are displayed along with a list of problems that have been found with
the password strength.

Once the user has reviewed the results of the analysis, she can select the
websites whose password she would like to change by checking the checkbox next
to it. By default, all passwords for which a problem has been found will be
selected. Clicking the “Open Selected Websites” button will open all the
selected websites in a new tab. The user must then find the password change
link, change their password, and ask Firefox to save it again.

STRENGTH TESTS
-----------------
There are many factors that contribute to password strength. Password Analyzer
uses a set of tests that evaluate the strength across various dimensions. Each
test sets a result message which is displayed in the problem list and a score
which is summed across all the tests to rank the passwords in strength. In the
current implementation, each test simply sets a score of 1 or 0.

Duplicates
--------------
Password reuse across multiple websites is a very common issue. A study by
Trusteer in 2010 showed that 73% of users shared their online banking password
with at least one nonfinancial website. The duplicates test counts the number of
times a password is reused. A password fails this test if the count is more than
0.

Entropy
-----------
Entropy is a common measure of password strength. Password Analyzer uses the
standard entropy formula as provided in the NIST Electronic Authentication
Guideline: log2(alphabet\_size^length). Four different alphabets are considered:
“digits”, “lowercase alpha”, and “alpha-numeric”, and “all”. The entropy test
uses regular expressions to determine whether a password consists of only
characters in the first three alphabets, defaulting to “all” if it does not. A
password fails this test if it has an entropy less than 52 (the entropy of an
8-character password with a mix of lowercase, uppercase, digits, and special
characters).

Common
----------
Analysis of passwords obtained from database comprises have shown that some
passwords, such as “password” and “12345”, are very common among users. Password
Analyzer uses a list of such passwords compiled by the Openwall project. A
password fails this test if it is a substring of any word in the list.

FUTURE WORK
--------------
The current analysis algorithms are very simplistic and only capture a small
subset of the potential sources of password weakness. Some ideas for future 
enhancements include:

* Calculate password similarity using Levenshtein distance.
* Use a larger password dictionary.
* Look for personal info in passwords such as dates and the user’s name.
* Automatically find a website’s change password page and direct users to it, or
make list of urls for popular sites.
* Don't treat subdomains as duplicates

REFERENCES
-------------
Reused Login Credentials. White paper from http://www.trusteer.com/sites/default/files/cross-logins-advisory.pdf

Special Publication 800-63: NIST Electronic Authentication Guideline from http://csrc.nist.gov/publications/nistpubs/800-63/SP800-63V1_0_2.pdf
