import { Selector, t } from 'testcafe';
import { addTimeoutPage, listEventPage, signOutPage } from './simple.page';
import { landingPage } from './landing.page';
import { signInPage } from './signin.page';
import { signUpPage } from './signup.page';
import { navBar } from './navbar.component';

/* global fixture:false, test:false */

/** Credentials for one of the sample users defined in settings.development.json. */
const credentials = { username: 'john@apms.com', password: 'changeme' };
const newCredentials = { username: 'jane@apms.com', password: 'changeme' };

fixture('meteor-application-template-production localhost test with default db')
  .page('http://localhost:3000');

test('Test that landing page shows up', async () => {
  await landingPage.isDisplayed();
});

test('Test that signin and signout work', async () => {
  await navBar.gotoSignInPage();
  await signInPage.signin(credentials.username, credentials.password);
  await navBar.isLoggedIn(credentials.username);
  await navBar.logout();
  await signOutPage.isDisplayed();
});

test('Test that user pages show up', async () => {
  await navBar.gotoSignInPage();
  await signInPage.signin(credentials.username, credentials.password);
  await navBar.isLoggedIn(credentials.username);
  await navBar.gotoAddTimeoutPage();
  await addTimeoutPage.isDisplayed();
  await navBar.gotoListEventPage();
  await listEventPage.isDisplayed();
  // want to see if we can get to the editStuffPage
 /* const editLinks = await Selector(`.${PAGE_IDS.EDIT_EVENT_DAY}`);
  await t.click(editLinks.nth(0));
  await editEventPage.isDisplayed();*/
  await navBar.logout();
  await signOutPage.isDisplayed();
});

test('Test that sign up and sign out work', async () => {
  await navBar.gotoSignUpPage();
  await signUpPage.isDisplayed();
  await signUpPage.signupUser(newCredentials.username, newCredentials.password);
  await navBar.isLoggedIn(newCredentials.username);
  await navBar.logout();
  await signOutPage.isDisplayed();
});
