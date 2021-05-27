# tasks2sheet
Exports tasks from a task list to a Google Sheet

Navigate to https://script.google.com/ and after accepting the prompts, use the + sign on the top-left to create a 'New Project'. Give the project a name, for example `Tasks2Sheets`. The file will be called `Code.gs` by default and have an empty function in there. Replace the content of the file with the provided `Code.gs` file. Update the first 3 variables in the file to set the name of the task list from which you want to export, as well as the Google Spreadsheet ID, and the sheet name within that spreadsheet. The task list name defaults to `Firstname Lastname's list`, while the Spreadsheet file ID can be found in its URL. The first sheet in a file will be called `Sheet1` by default.

Once saved, use the add/plus icon next to Services section to add the "Task API" with the default name of `Tasks`.

Select the `run` function from the script toolbar, and press the **▷** button to manually run it the first time. You will be asked to grant the required permission, for your copy of the script to access your data.

To schedule this script to run periodically, navigate to the trigger section with the ⏰ icon in the left panel, and add a time-driven trigger.
