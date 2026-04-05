# tests.py
# This file contains Selenium tests for the Django homepage

from django.test import LiveServerTestCase
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager


class HomepageTest(LiveServerTestCase):
    """
    Test class for verifying elements on the Django homepage.
    Uses Selenium WebDriver to simulate browser interaction.
    """

    def setUp(self):
        """
        Setup method that runs BEFORE each test.
        Initializes the Chrome WebDriver and opens the browser.
        """
        # Automatically download and configure the correct ChromeDriver version
        service = Service(ChromeDriverManager().install())
        self.driver = webdriver.Chrome(service=service)

        # Implicitly wait up to 5 seconds for elements to appear before throwing an error
        self.driver.implicitly_wait(5)

    def test_main_heading_text(self):
        """
        Test method to verify the <h1 id="main-heading"> element
        on the Django homepage contains the correct text.
        """

        # Step 1: Navigate to the Django homepage (LiveServerTestCase starts it automatically)
        self.driver.get(self.live_server_url)

        # Step 2: Locate the <h1> element using its id attribute
        heading = self.driver.find_element(By.ID, "main-heading")

        # Step 3: Assert that the heading text matches exactly
        self.assertEqual(heading.text, "Welcome to My Site!")
        print("✅ Test passed: Heading text is correct!")

    def tearDown(self):
        """
        Teardown method that runs AFTER each test.
        Closes the browser to free up resources.
        """
        # Close the browser window after each test
        self.driver.quit()


# Entry point to run the tests directly
if __name__ == "__main__":
    import unittest
    unittest.main()