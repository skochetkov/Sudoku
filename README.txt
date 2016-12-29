Completed Date:   Dec 18, 2016

Author: 	  Sergey Kochetkov

    

    The idea is to use MVC/AngluarJS for given project.
    There are many ways to structure the code for an application but AngularJS encourage using Model-View-Controller which is
    most suitable for the solution. Algorithm used in the project is Backtracking - probably the simplest algorithms for those kind of
    games. As my hobby I used to create computer board games (checkers, go, my own board games) and very well familiar with this algo.
    
    UI (View):
    As per the project purpose, UI needs to be as minimum as possible but to demonstrate the following:
    - Basic HTML 
    - Demonstrate using CSS
    - Board game needs to be represented as generic AngularJS directive
    
    CODE:
    I tried to be as "wordy" as possible to show my logic. First thing in my mind was rule "think about people who will read it".
    Readability and simplicity are my main focuses here.
    
    LOGIC/BRIDGE (Model/Controller)
    - Used AngularJS custom service for handling solver logic and additional requirements such as updating Sudoku board with new data
    
    INPUT EXTERNAL DEFINITIONS:
    I don't validate if sudoku definition is correct. I tested my solution only with two combinations: from given project and the one 
    I found in internet where they say it is the most difficult sudoku in the worlds...well... I don't know how to prove it. 
        
    MANUAL TESTING (TEST CASES):
    - Default definition data is OK
    - Load simple sudoku data from external source (txt file) with defined format
    - Load hard sudoku data from external source (txt file) with defined format
    - Load incorrect format data file
    - Load empty sudoku definition
    
    Out of scope for manual testing:
    - Load data with correct format but with intentionally incorrect combinations (i.e. same digits in the same row)
    
    For performance test I put in tests directory the most difficult sudoku definitions in the worlds created some very smart math guy. Files called:
    HardestSudokuInTheWorld.txt and AnotherHardestSudokuInTheWorld.txt. There are some other test files in that directory.
    
    UNIT TESTING:
    Unit testing is out of scope for this project but if required it can be done with following set up:
    - Node.js installed. 
    - For the testing suite use Mocha and Chai
    
    PACKAGE HIERARCHY:
    - root - sudoku.html and README.txt
    --- css (for styling)
    --- js (javascript file)
    --- tests (all test cases for manual and performance testing)
    
    DISCLAIMER: 
    Some ideas (such as custom file loader where as standard file loader is not supported by AngularJS) were taken from stackoverflow.
    
    
    DEVELOPERS NOTES
    For simplicity purpose I use one js file stored in js folder as angular.min.js
    I used different options for same language constructs to demonstrate different styles, for example: for (;;) and for (in)
    I left commented sections (usually console.logs) for case if a bug is found. Needs to be clean up afterward.
    I tested my solution with Chrome 55.0 and IE11 browsers only.  