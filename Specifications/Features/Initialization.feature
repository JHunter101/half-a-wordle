Feature: Initialization
  As a player
  I want to configure and start a game
  So that I can play with my preferred rules

Background: 
    Given I am on the home screen

Scenario: Main Menu
    Then I should see the main menu

Scenario: Initial keyboard no hints
    Given No hints are available
    When I click the 'start game' button
	Then all letters should have state 'Pending' on the on screen keyboard

Scenario: Initial hints
  Given the following words are valid hints:
    | word  |
    | BLISS |
    | FIGHT |
  And I start a game with the target word is 'CRANE'
  Then the following words should be visible on the game board:
    | word  |
    | BLISS |
    | FIGHT |


Scenario Outline: Start game with custom settings
    When I set the word length to <word length>
    And I set the max attempts to <max attempts>
    And I click the 'start game' button
    Then the game board should be visible
    And I should see <letter tiles> letter tiles on the screen
    Examples:
        | word length | max attempts | letter tiles |
        | 5           | 6            | 30           |
        | 4           | 6            | 24           |
        | 6           | 8            | 48           |

Scenario: Start a new game with the same settings after playing again
    Given No hints are available
    When I set the word length to 10
    And I set the max attempts to 4
    And I click the 'start game' button
    And I repeatedly submit incorrect guesses until the game ends
    And I click the 'play again' button
    Then the game board should be visible
    Then all letters should have state 'Pending' on the on screen keyboard
    And I should see 40 letter tiles on the screen

Scenario: Start a new game with the previous settings from the main menu
    Given No hints are available
    When I set the word length to 10
    And I set the max attempts to 4
    And I click the 'start game' button
    And I repeatedly submit incorrect guesses until the game ends
    And I click the 'main menu' button
    Then I should see the main menu
    And the word length is set to 10
    And the max attempts is set to 4
    When I click the 'start game' button
    Then the game board should be visible
    Then all letters should have state 'Pending' on the on screen keyboard
    And I should see 40 letter tiles on the screen

Scenario: Start a new game with updated settings from the main menu
    Given No hints are available
    When I set the word length to 10
    And I set the max attempts to 4
    And I click the 'start game' button
    And I repeatedly submit incorrect guesses until the game ends
    And I click the 'main menu' button
    Then I should see the main menu
    When I set the word length to 8
    And I set the max attempts to 6
    When I click the 'start game' button
    Then the game board should be visible
    Then all letters should have state 'Pending' on the on screen keyboard
    And I should see 48 letter tiles on the screen