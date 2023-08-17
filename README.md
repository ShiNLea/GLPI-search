# Project _Jerez_ - GLPI Spec Tool

Because I'm lazy, and I have the gall to use a good cause as a terrible excuse to learn JS and HTML.

## What it does

This app taps into GLPI's API endpoints, gets data based on the service tag of the computer entered, and formats the data nicely into an HTML table, which can then be downloaded as a CSV file.

## Usage
### Authentication
Navigate to the "My settings" menu in GLPI. Scroll to the bottom and click the box that says "Regenerate" beside the field where the API token is supposed to be. 
![API_Token](https://github.com/RyanL-AtBDGL/GLPI-search/assets/135175046/acb37816-5889-41db-af3f-4ad6d06ec662)
Click save, and the page should reload itself. From there, you can click on the "API token" field and your token will be copied to your clipboard. 
Open the app, and paste your token into the only visible field on the page. Click "Submit Token", and if all goes well, you should be authenticated. 
![Auth](https://github.com/RyanL-AtBDGL/GLPI-search/assets/135175046/2981b7b3-fcde-46b4-8f34-f8fdd04b2a86)

### Searching
Assuming you haven't skipped authentication, searching is easy.
To search, simply type either the name or service tag of the computer into the "Service Tag" field, and click "Search".
![Search](https://github.com/RyanL-AtBDGL/GLPI-search/assets/135175046/d4a6553d-6e8b-463f-86d5-9bd155374704)
> Using the service tag was shown above, but the name of the device works too.

## Bells and Whistles
### Dark Mode Toggle
Yes, there's a light mode, it's just not enabled by default. To enable, simply click the only button on the top right corner. Bear in mind that the changes do NOT stay; if you like light mode then you have to change it every time. I haven't figured out how to keep it yet.
### (Almost) Automatic Screen Size
If you have multiple systems of the same model, the screen size will fill automatically **provided that you manually enter the screen size the first time you search a new model**. The app will copy the entry for the first system of its kind, which is to say that it'll be blank if you don't fill it out. 
![Screen Size](https://github.com/RyanL-AtBDGL/GLPI-search/assets/135175046/e5e12158-f088-4c4c-b502-c2cf4c1ff97e)

## Other than that...
the app worked perfectly fine for my usage in the Summer of 2023. If you have any issues, I dunno that sounds like both a you problem and a skill issue. 
> This app was created by an employee of [Black Diamond Group](https://www.blackdiamondgroup.com/).
