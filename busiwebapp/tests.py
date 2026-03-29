# Import necessary modules
from django.test import LiveServerTestCase
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager


class HomePageTest(LiveServerTestCase):
    """
    This test class checks the Django homepage using Selenium.
    It verifies that the site header shows the brand identity.
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

    def test_home_shows_brand_logo(self):
        """
        Test case:
        1. Navigate to the homepage
        2. Confirm the header shows the Street.Haven brand
        """

        self.browser.get(self.live_server_url)

        logo = self.browser.find_element(By.CLASS_NAME, "logo-text")
        self.assertIn("STREET", logo.text)
        self.assertIn("HAVEN", logo.text)