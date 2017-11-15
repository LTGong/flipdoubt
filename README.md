# Module 3 Group Assignment: Note-a-matic

CSCI 5117, Fall 2017, [assignment description](https://docs.google.com/document/d/13q79EywC9TzWts9K-10b_tKA-ZVyv9_avWGJpgprA6A)

## App Info:

* Team Name: Frozen City Savages
* App Name: Flip Doubt
* App Link: <https://lit-sea-91058.herokuapp.com/>

### Students

* Xinyi Wang, wang4831@umn.edu
* William Lane, wwlane@umn.edu
* Karan Jaswani, jaswa003@umn.edu
* Estelle Smith, smit3694@umn.edu

## Key Features

**Describe the most challenging features you implemented
(one sentence per bullet, maximum 4 bullets):**

* Amazon Mechanical Turk integration required learning how to automatically create HITs and retrieve them from AMT. We used a SOAP protocol API by Barrios (see below) to help, but this was not well documented so was quite challenging to figure out how to use.
* Using fusion charts to visualize data about thought frequency


## Screenshots of Site

![homepage](/home.png?raw=true "homepage")
![profile](/profile.png?raw=true "profile page")
![transform](/transform_gallery.png?raw=true "transform and gallery")


## External Dependencies

**Document integrations with 3rd Party code or services here.
Please do not document required libraries (e.g., Express, Bulma).**

* Amazon Mechanical Turk: Used for "automatic" annotation of negative thoughts
   (we used the api via Jose Barrios' js wrapper at https://github.com/JoseBarrios/api-mturk)
* social-share : Used to share to twitter
* Used a bunch of images from google searchs as background photos for the thoughts.
* fusion charts https://www.fusioncharts.com/react-charts/#/demos/ex1 : graph and table on user page


**If there's anything else you would like to disclose about how your project
relied on external code, expertise, or anything else, please disclose that
here:**

CSS Flipping Animaiton: <https://davidwalsh.name/css-flip/>
CSS notification animation https://codepen.io/sugimo/pen/DgLty
