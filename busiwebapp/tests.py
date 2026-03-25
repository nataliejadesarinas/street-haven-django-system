# Import necessary modules
from django.test import LiveServerTestCase
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager


class HomePageTest(LiveServerTestCase):
    """
    This test class checks the Django homepage using Selenium.
    It verifies that the main heading exists and contains the correct text.
    """

    def setUp(self):
        """
        Setup method runs before each test.
        It initializes the browser driver using webdriver-manager.
        """

        # Configure Chrome options (optional but recommended)
        chrome_options = webdriver.ChromeOptions()
        chrome_options.add_argument("--start-maximized")

        # Launch Chrome using webdriver-manager (auto installs driver)
        self.browser = webdriver.Chrome(
            service=Service(ChromeDriverManager().install()),
            options=chrome_options
        )

    def tearDown(self):
        """
        Teardown method runs after each test.
        It closes the browser to free resources.
        """
        self.browser.quit()

    def test_main_heading_text(self):
        """
        Test case:
        1. Navigate to the homepage
        2. Find the <h1> element with id="main-heading"
        3. Check if its text matches the expected value
        """

        # Step 1: Open the Django live server URL
        self.browser.get(self.live_server_url)

        # Step 2: Locate the <h1 id="main-heading"> element
        heading = self.browser.find_element(By.ID, "main-heading")

        # Step 3: Assert that the text is exactly correct
        self.assertEqual(heading.text, "Welcome to My Site!")