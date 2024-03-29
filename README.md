# Project _Jerez_ - GLPI Spec Tool

Because I'm lazy, and I have the gall to use a good cause as a terrible excuse to learn JS and HTML.

## What it does

This app taps into GLPI's API endpoints, gets data based on the service tag of the computer entered, and formats the data nicely into an HTML table, which can then be downloaded as a CSV file.

## Usage
### Authentication
Navigate to the "My settings" menu in GLPI. Scroll to the bottom and click the box that says "Regenerate" beside the field where the API token is supposed to be. 

![API_Token](https://github.com/ShiNLea/GLPI-search/assets/58052631/73fd5855-bce4-4e6b-b465-a31abf117360)

Click save, and the page should reload itself. From there, you can click on the "API token" field and your token will be copied to your clipboard. 
Open the app, and paste your token into the only visible field on the page. Click "Submit Token", and if all goes well, you should be authenticated. 

![Auth](https://github.com/ShiNLea/GLPI-search/assets/58052631/f0d34323-ee5b-4fdf-806b-4005b8d62ceb)

### Searching
Assuming you haven't skipped authentication, searching is easy.
To search, simply type either the name or service tag of the computer into the "Service Tag" field, and click "Search".
![Search](https://github.com/ShiNLea/GLPI-search/assets/58052631/8c47aa65-e33c-40ec-976d-1ed00abcec22)

> Using the service tag was shown above, but the name of the device works too.

## Bells and Whistles
### Dark Mode Toggle
Yes, there's a light mode, it's just not enabled by default. To enable, simply click the only button on the top right corner. Bear in mind that the changes do NOT stay; if you like light mode then you have to change it every time. I haven't figured out how to keep it yet.
### (Almost) Automatic Screen Size
If you have multiple systems of the same model, the screen size will fill automatically **provided that you manually enter the screen size the first time you search a new model**. The app will copy the entry for the first system of its kind, which is to say that it'll be blank if you don't fill it out. 

![Screen Size](https://github.com/ShiNLea/GLPI-search/assets/58052631/f54edb76-7c02-4ed6-8577-1c6c05902222)


## Other than that...
the app worked perfectly fine for my usage in the Summer of 2023. If you have any issues, I dunno that sounds like both a you problem and a skill issue. 
> This app was created for internal usage at [Black Diamond Group](https://www.blackdiamondgroup.com/).
