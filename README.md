# banca-tommaso-pfm
A personal finance management app to manage payment cards.


# Task 1 Issues


Unable to find grayscale visa and mastercard icons. Used full color ones, but set the code
to easily swap them out once we have them

The N26 log does not play nice with our design. It has a transparent background but the letters in the logo
are also transparent. This means when we set the BG to white it has weird "corners" on it. Was unable to fix
by setting border radius. Other logos are fine.

There was no way to infer which currency is being used, so I defaulted to the same as the mockup.

I am not confident there is a way to infer if a card is a debit or credit card. All data returned by API had a "CIRCUIT" that equaled either mastercard or visa. If we can use this to infer the card type, can we get a full list of possible options? At the moment, it is only coded for work with visa and mastercard.