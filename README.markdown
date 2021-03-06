UI Engineering Puzzle
Part I: Write a function (either PHP or JS) to lay out a series of events on the calendar for a single day.
 
Events will be placed in a container.  The top of the container represents 9am and the bottom represents 9pm. The width of the container will be 620px (10px padding on either side) and the height will be 720px (1 pixel for every minute between 9am and 9pm). The objects should be laid out so that they do not visually overlap. If there is only one event at a given time slot, its width should be 600px.
 
There are 2 major constraints:
* Every colliding event must be the same width as every other event that it collides width.
* An event should use the maximum width possible while still adhering to the first constraint.
 
 
The input to the function will be an array of event objects with the start and end times of the event. Example (JS):

    [
      {id : 1, start : 60, end : 120},  // an event from 10am to 11am
      {id : 2, start : 100, end : 240}, // an event from 10:40am to 1pm
      {id : 3, start : 700, end : 720}  // an event from 8:40pm to 9pm
    ]
 
The function should return an array of event objects that have the left and toppositions set (relative to the top left of the canvas), in addition to the id, start, and end time.
 
    /**
    Lays out events for a single  day
     
    @param array  events  
     An array of event objects. Each event object consists of a start time, end
     Time (measured in minutes) from 9am, as well as a unique id. The
     Start and end time of each event will be [0, 720]. The start time will
     Be less than the end time.  The array is not sorted.
     
     @return array
     An array of event objects that has the width, the left and top positions set,
     In addition to start time, end time, and id. 
     
    **/
 
    Function  layOutDay(events) {
     
    }
 
Part II: Use your function from Part I to create a web page that is styled just like the example image  calendar2.png with the following calendar events:
 
* An event that starts at 9:30am and ends at 11:30am
* An event that starts at 6:00pm and ends at 7:00pm
* An event that starts at 6:20pm and ends at 7:20pm
* An event that starts at 7:10pm pm and ends at 8:10pm
 
Here are some frequently asked questions:
1. Are frameworks such as JQuery, MooTools, etc. allowed?  Yes, but please include the file with your source code.
2. What PHP version can be used? Anything under 5.2.5
3. Is there a maximum bound on the number of events?  You can assume a maximum of 100 events for rendering reasons, but your solution should be generalized.
4. What browsers will be tested? Your solution should render correctly in all commonly used browsers (FF, Safari, IE6/7/8)
5. Does my solution need to match the image pixel for pixel? No, we will not be testing for pixel matching
