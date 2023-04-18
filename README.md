<h2 align="center">Aircraft Phase Management-System</h2>
<h4 align="center">209th Aviation Support Battalion</h4>
<p align="center">
    :small_airplane:
</p>

## About APM
Aircraft Phase Management System manages and track military aircraft while they undergo maintenance inspections.

## :computer: How to Use the App

1. Clone the GitHub repository to your computer. 
2. Make sure that you have meteor installed, a guide can be found [here](https://www.meteor.com/developers/install).
3. Next, cd into the app/ directory of your local copy of the repo, and install third party libraries with: ```meteor npm install```
4. Run the system with: ```meteor npm run start```
5. Go to http://localhost:3000 to see the app.

## :door: Sign Up Credentials
1. email: john@apms.com, password: changeme

#### Sign In Page: 
<img width="700" alt="login" src="https://user-images.githubusercontent.com/60526884/232670224-e9455e58-c6d4-46ac-837e-3583f1a14d11.png">

#### Sign Up Page [New Users]: 
<img width="700" alt="signup" src="https://user-images.githubusercontent.com/60526884/232673235-93709266-c789-4782-9797-16908f9c2e9e.png">

#### User Landing Page: 
<img width="700" alt="landing-user" src="https://user-images.githubusercontent.com/60526884/232672611-7fb2509d-c62d-4101-a29a-98c1c59134aa.png">

#### Calendar Page: 
<img width="700" alt="calendar" src="https://user-images.githubusercontent.com/60526884/232667624-18afea03-c17b-4317-a577-4822dd655cd5.png">

#### Calendar Day Information: 
<img width="700" alt="calendar-day-manhours" src="https://user-images.githubusercontent.com/60526884/232667622-27d9cb38-3cc0-4261-990a-d99f72c22c0f.png">

#### Add Timeout Tab: 
<img width="700" alt="add-timeouts" src="https://user-images.githubusercontent.com/60526884/232673538-e6891682-68ed-4bb6-9042-324fd76b60bc.png">

#### List Timeout Tab: 
<img width="700" alt="list-timeouts" src="https://user-images.githubusercontent.com/60526884/232673998-e60c5022-ca66-4730-ae08-f5c324d20250.png">

#### Edit Timeout Modal: 
<img width="700" alt="edit-timeout" src="https://user-images.githubusercontent.com/60526884/232674449-fb579678-9db1-4d12-a158-1151b37fb61a.png">

#### Add Phase Lane Modal: 
<img width="700" alt="add-phase" src="https://user-images.githubusercontent.com/60526884/232667619-d2956238-c48f-4d0c-b838-21a2bc37f35f.png">

#### Edit Phase Lane Modal: 
<img width="700" alt="edit-phase-lane" src="https://user-images.githubusercontent.com/60526884/232667628-c0588d77-136c-44a4-8d55-cce44f43a16a.png">

#### Add Same Day Event - April 17, 2023 as of today:
<img width="700" alt="add-event-same-day" src="https://user-images.githubusercontent.com/60526884/232667612-b749ba06-bf79-42c9-9d70-06d0bee7727d.png">

#### List Only Today's Event - April 17, 2023 as of today: 
<img width="700" alt="phase-lane-same-day-events" src="https://user-images.githubusercontent.com/60526884/232667653-f11753b0-b170-40be-bf03-107f2d793f79.png">

#### Add New Event - November 16, 2022 containing 23 events: 
<img width="700" alt="add-new-event" src="https://user-images.githubusercontent.com/60526884/232667614-44fdb37c-a2c4-4761-8e6d-1cb32b66d144.png">

#### Add New Event Report - November 16, 2022 containing 23 events: 
```
Formula for manhours used in the day: (sum of all 'time spent' of the day) x (sum of all MLs of the day) 
A typical phase team is 12 people assigned a 10.5 hr day = 126 available manhours a day.
Of that, 1.5 hours per person is dedicated to physical fitness and 1 hour for lunch = 2.5 x 12= 30.
30 - 126 = 96 maintenance manhours per typical day. (Minus any lost time . 
I.e 2 hours for each person for mahalo days = 2 x 12- 96 or 72 MMH, and such for any half days or trn days etc).
Each phase has a list of task (aprox 300) and each task has a corresponding manhours associated with it. 
```
<img width="700" alt="add-new-event-report" src="https://user-images.githubusercontent.com/60526884/232667617-c8dd17ef-bbd5-42fc-ae45-dcd436b7d9a8.png">

`Note: If the event is added in a Mahalo Friday, the number of manhours available will be less. 
However, if there is a need to modify the amount of off hours for Mahalo friday, e.g modify from 2 hours to 1. 
This change will show on the report - in this case, the number of manhours available will increase.`

#### Calendar Events - After Added: 
<img width="700" alt="event-after-added" src="https://user-images.githubusercontent.com/60526884/232667632-765988e0-6029-46c7-9ce1-bf97f7bd0fac.png">

#### Add New Event Holiday - July 4th, 2023: 
<img width="700" alt="add-new-event-holiday" src="https://user-images.githubusercontent.com/60526884/232667616-d292b1d4-2fa3-47ac-b1fb-52541fc5bdbd.png">

#### Edit Events: 
<img width="700" alt="edit-events" src="https://user-images.githubusercontent.com/60526884/232667627-60ac1fe0-7381-4f8e-8a0a-ce0481b006d3.png">

#### Import CSV File - Events for Phase Lane #02: 
<img width="700" alt="import-csv" src="https://user-images.githubusercontent.com/60526884/232680355-733d641d-6456-4203-a956-886a6c8184c1.png">

#### Events For Phase Lane #02 - After File Imported: 
<img width="700" alt="events-for-phase-lane_2" src="https://user-images.githubusercontent.com/60526884/232667635-cc0c5633-28ae-402b-ba85-2e7f9c98ba38.png">

#### Import CSV File - Fix Dates (Weekends and Holidays): 
```
ImportButton.jsx includes logic to change the event's date if the file contains dates that fall on weekends or holidays.
Three more rows are shown in the images below for testing. The top row looks for holidays with several days, the second
row looks for holidays with just one day, and the last row looks for weekends.
```
<img width="700" alt="import-file-csv" src="https://user-images.githubusercontent.com/60526884/232667647-fc86f1ba-934c-4bd3-837f-e00b9ad87e3e.png">

1. Holiday: `Christmas Day (2023-12-24 to 2023-12-27)`
- Event Initial Date: `2023-12-25`
- Event Final Date: `2023-12-28` (*after corrected*)

<img width="700" alt="import-check-holidays" src="https://user-images.githubusercontent.com/60526884/232667640-fd4e72a2-6346-43d6-b90e-aed72a4132e3.png">

2. Holiday: `Independece Day (2023-07-04)`
- Initial Event Date: `2023-07-04`
- Final Event Date: `2023-07-05` (*after corrected*)
<img width="700" alt="import-check-holiday" src="https://user-images.githubusercontent.com/60526884/232667638-fc1307af-de72-4570-ad6e-666d8dd544dc.png">

3. Weekend: `2023-04-09 (Sunday)`
- Initial Event Date: `2023-04-09`
- Final Event Date: `2023-04-10` (*after corrected*)

<img width="700" alt="import-check-weekend" src="https://user-images.githubusercontent.com/60526884/232667643-9767d9af-b555-4572-84ff-d5cc67cf8db2.png">

#### List All Events: 
<img width="700" alt="all-events" src="https://user-images.githubusercontent.com/60526884/232667621-6779a530-9585-4d18-8001-c3aff8e9e1ab.png">

#### Sign Out Page: 
<img width="700" alt="landing" src="https://user-images.githubusercontent.com/60526884/232667649-648c9ca7-ab2e-4e58-b28e-9cf9b5fe6000.png">

## :green_book: Documentation for Main Functionalities
#### path: ..imports/ui/pages/
`AddEventDay.jsx`: Create new events to a phase lane.
- setTimeSpent: Save value for number of hours from `start` and `end`.
- calcManWorkHrsAvailability: Calculate how many manwork hours are available within the day.
- calcManWorkHrsUsed: Calculate how many manwork hours were are used in the day.
- isDateHol: Find if there is a holiday within that day.
- offHrs: Find how many hours will not be used, e.g 2 hours for Mahalo Friday.

`AddPhaseLane.jsx`: Create a new phase lane to the calendar.
setBg: Set random colour to the background.

`AddTimeout.jsx`: Create new holiday, mahalo friday or tranning day.

`Calendar.jsx`: Show all the events, holidays, etc in the calendar.

`Contact.jsx`: Page with information about the sponsor.

`EditEventDay.jsx`: Edit events from the phase lane.

`EditPhaseLane.jsx`: Edit a phase lane - the color, which is assigned randomly, can't be edited.

`EditTimeout.jsx`: Edit holidays, mahalo fridays, and training days.

`ImportButton.jsx`: Import events from a CSV file to a phase lane.
1. Modify the event data to fit the calendar format.
2. Find the number of conflicting days from holidays.
3. Check if day falls in a weekend, if it does, keep looping until day is not a weekend anymore.

`ListAllEvents.jsx`: List all the events of the system.
- filteredData: Filter events by title based on the input of the user.

`ListEventAccordion.jsx`: According that shows events from lane, event from that day, and add event.

`ListEventDay.jsx`: List only the events from the phase lane.

`ListTimeout.jsx`: List all holidays, mahalo fridays and tranning days.

`TimeoutTabs.jsx`: Tabs that include the add and list timeout functions.

## :card_file_box: Databse
#### Default Database
To add default database for collections, modify imports/startup/server/Mongo.js to insert the items from the `settings.development.json`.

## :test_tube: Testing (TestCafé)

<img width="700" alt="test-acceptance-development-single-terminal" src="https://user-images.githubusercontent.com/60526884/232707005-efa370e7-6f6a-4def-8a91-162e72ffb627.png">
<img width="700" alt="test-acceptance-development-terminal" src="https://user-images.githubusercontent.com/60526884/232707015-88524808-ffb9-4af1-8326-9503fab2add1.png">

## Team Members
- [Ana Araujo](https://acatarinaoaraujo.github.io/)
- [Jingzhe Feng](https://github.com/jingzhef)

[![ci-meteor-application-template-production](https://github.com/ics-software-engineering/meteor-application-template-production/actions/workflows/ci.yml/badge.svg)](https://github.com/ics-software-engineering/meteor-application-template-production/actions/workflows/ci.yml)

This project used the Meteor Application Template Production, please see http://ics-software-engineering.github.io/meteor-application-template-production/ for details.


