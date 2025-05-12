# Test info

- Name: Testy generowania fiszek >> Generowanie fiszek z tekstu źródłowego
- Location: C:\Users\Gutek\Documents\10x-cards\tests\e2e\generation.spec.ts:20:3

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toHaveURL(expected)

Locator: locator(':root')
Expected string: "http://localhost:3000/dashboard"
Received string: "http://localhost:3000/auth/login?email=test-e2e%40example.com&password=Test123%21%40%23"
Call log:
  - expect.toHaveURL with timeout 5000ms
  - waiting for locator(':root')
    9 × locator resolved to <html lang="en" data-astro-cid-sckkx6r4="">…</html>
      - unexpected value "http://localhost:3000/auth/login?email=test-e2e%40example.com&password=Test123%21%40%23"

    at loginUser (C:\Users\Gutek\Documents\10x-cards\tests\e2e\generation.spec.ts:11:22)
    at C:\Users\Gutek\Documents\10x-cards\tests\e2e\generation.spec.ts:17:5
```

# Page snapshot

```yaml
- text: 10x
- heading "Zaloguj się" [level=1]
- text: Adres email
- textbox "Adres email"
- text: Hasło
- link "Zapomniałem hasła":
  - /url: /auth/reset-password
- textbox "Hasło"
- button "Zaloguj się"
- paragraph: Problemy z logowaniem?
- button "Zaloguj się przez link wysłany na email"
- paragraph:
  - text: Nie masz jeszcze konta?
  - link "Zarejestruj się":
    - /url: /auth/register
- checkbox "Use dark theme"
- text: Use dark theme
- banner:
  - heading "Error" [level=2]
  - heading "An error occurred." [level=1]
- text: supabaseKey is required.
- heading "main/SupabaseClient.js:45:19" [level=2]
- button "Open in editor"
- code: "\"use strict\"; var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) { function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); } return new (P || (P = Promise))(function (resolve, reject) { function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } } function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } } function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); } step((generator = generator.apply(thisArg, _arguments || [])).next()); }); }; Object.defineProperty(exports, \"__esModule\", { value: true }); const functions_js_1 = require(\"@supabase/functions-js\"); const postgrest_js_1 = require(\"@supabase/postgrest-js\"); const realtime_js_1 = require(\"@supabase/realtime-js\"); const storage_js_1 = require(\"@supabase/storage-js\"); const constants_1 = require(\"./lib/constants\"); const fetch_1 = require(\"./lib/fetch\"); const helpers_1 = require(\"./lib/helpers\"); const SupabaseAuthClient_1 = require(\"./lib/SupabaseAuthClient\"); /** * Supabase Client. * * An isomorphic Javascript client for interacting with Postgres. */ class SupabaseClient { /** * Create a new client for use in the browser. * @param supabaseUrl The unique Supabase URL which is supplied when you create a new project in your project dashboard. * @param supabaseKey The unique Supabase Key which is supplied when you create a new project in your project dashboard. * @param options.db.schema You can switch in between schemas. The schema needs to be on the list of exposed schemas inside Supabase. * @param options.auth.autoRefreshToken Set to \"true\" if you want to automatically refresh the token before expiring. * @param options.auth.persistSession Set to \"true\" if you want to automatically save the user session into local storage. * @param options.auth.detectSessionInUrl Set to \"true\" if you want to automatically detects OAuth grants in the URL and signs in the user. * @param options.realtime Options passed along to realtime-js constructor. * @param options.global.fetch A custom fetch implementation. * @param options.global.headers Any additional headers to send with each network request. */ constructor(supabaseUrl, supabaseKey, options) { var _a, _b, _c; this.supabaseUrl = supabaseUrl; this.supabaseKey = supabaseKey; if (!supabaseUrl) throw new Error('supabaseUrl is required.'); if (!supabaseKey) throw new Error('supabaseKey is required.'); ^ const _supabaseUrl = (0, helpers_1.stripTrailingSlash)(supabaseUrl); this.realtimeUrl = `${_supabaseUrl}/realtime/v1`.replace(/^http/i, 'ws'); this.authUrl = `${_supabaseUrl}/auth/v1`; this.storageUrl = `${_supabaseUrl}/storage/v1`; this.functionsUrl = `${_supabaseUrl}/functions/v1`; // default storage key uses the supabase project ref as a namespace const defaultStorageKey = `sb-${new URL(this.authUrl).hostname.split('.')[0]}-auth-token`; const DEFAULTS = { db: constants_1.DEFAULT_DB_OPTIONS, realtime: constants_1.DEFAULT_REALTIME_OPTIONS, auth: Object.assign(Object.assign({}, constants_1.DEFAULT_AUTH_OPTIONS), { storageKey: defaultStorageKey }), global: constants_1.DEFAULT_GLOBAL_OPTIONS, }; const settings = (0, helpers_1.applySettingDefaults)(options !== null && options !== void 0 ? options : {}, DEFAULTS); this.storageKey = (_a = settings.auth.storageKey) !== null && _a !== void 0 ? _a : ''; this.headers = (_b = settings.global.headers) !== null && _b !== void 0 ? _b : {}; if (!settings.accessToken) { this.auth = this._initSupabaseAuthClient((_c = settings.auth) !== null && _c !== void 0 ? _c : {}, this.headers, settings.global.fetch); } else { this.accessToken = settings.accessToken; this.auth = new Proxy({}, { get: (_, prop) => { throw new Error(`@supabase/supabase-js: Supabase Client is configured with the accessToken option, accessing supabase.auth.${String(prop)} is not possible`); }, }); } this.fetch = (0, fetch_1.fetchWithAuth)(supabaseKey, this._getAccessToken.bind(this), settings.global.fetch); this.realtime = this._initRealtimeClient(Object.assign({ headers: this.headers, accessToken: this._getAccessToken.bind(this) }, settings.realtime)); this.rest = new postgrest_js_1.PostgrestClient(`${_supabaseUrl}/rest/v1`, { headers: this.headers, schema: settings.db.schema, fetch: this.fetch, }); if (!settings.accessToken) { this._listenForAuthEvents(); } } /** * Supabase Functions allows you to deploy and invoke edge functions. */ get functions() { return new functions_js_1.FunctionsClient(this.functionsUrl, { headers: this.headers, customFetch: this.fetch, }); } /** * Supabase Storage allows you to manage user-generated content, such as photos or videos. */ get storage() { return new storage_js_1.StorageClient(this.storageUrl, this.headers, this.fetch); } /** * Perform a query on a table or a view. * * @param relation - The table or view name to query */ from(relation) { return this.rest.from(relation); } // NOTE: signatures must be kept in sync with PostgrestClient.schema /** * Select a schema to query or perform an function (rpc) call. * * The schema needs to be on the list of exposed schemas inside Supabase. * * @param schema - The schema to query */ schema(schema) { return this.rest.schema(schema); } // NOTE: signatures must be kept in sync with PostgrestClient.rpc /** * Perform a function call. * * @param fn - The function name to call * @param args - The arguments to pass to the function call * @param options - Named parameters * @param options.head - When set to `true`, `data` will not be returned. * Useful if you only need the count. * @param options.get - When set to `true`, the function will be called with * read-only access mode. * @param options.count - Count algorithm to use to count rows returned by the * function. Only applicable for [set-returning * functions](https://www.postgresql.org/docs/current/functions-srf.html). * * `\"exact\"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the * hood. * * `\"planned\"`: Approximated but fast count algorithm. Uses the Postgres * statistics under the hood. * * `\"estimated\"`: Uses exact count for low numbers and planned count for high * numbers. */ rpc(fn, args = {}, options = {}) { return this.rest.rpc(fn, args, options); } /** * Creates a Realtime channel with Broadcast, Presence, and Postgres Changes. * * @param {string} name - The name of the Realtime channel. * @param {Object} opts - The options to pass to the Realtime channel. * */ channel(name, opts = { config: {} }) { return this.realtime.channel(name, opts); } /** * Returns all Realtime channels. */ getChannels() { return this.realtime.getChannels(); } /** * Unsubscribes and removes Realtime channel from Realtime client. * * @param {RealtimeChannel} channel - The name of the Realtime channel. * */ removeChannel(channel) { return this.realtime.removeChannel(channel); } /** * Unsubscribes and removes all Realtime channels from Realtime client. */ removeAllChannels() { return this.realtime.removeAllChannels(); } _getAccessToken() { var _a, _b; return __awaiter(this, void 0, void 0, function* () { if (this.accessToken) { return yield this.accessToken(); } const { data } = yield this.auth.getSession(); return (_b = (_a = data.session) === null || _a === void 0 ? void 0 : _a.access_token) !== null && _b !== void 0 ? _b : null; }); } _initSupabaseAuthClient({ autoRefreshToken, persistSession, detectSessionInUrl, storage, storageKey, flowType, lock, debug, }, headers, fetch) { const authHeaders = { Authorization: `Bearer ${this.supabaseKey}`, apikey: `${this.supabaseKey}`, }; return new SupabaseAuthClient_1.SupabaseAuthClient({ url: this.authUrl, headers: Object.assign(Object.assign({}, authHeaders), headers), storageKey: storageKey, autoRefreshToken, persistSession, detectSessionInUrl, storage, flowType, lock, debug, fetch, // auth checks if there is a custom authorizaiton header using this flag // so it knows whether to return an error when getUser is called with no session hasCustomAuthorizationHeader: 'Authorization' in this.headers, }); } _initRealtimeClient(options) { return new realtime_js_1.RealtimeClient(this.realtimeUrl, Object.assign(Object.assign({}, options), { params: Object.assign({ apikey: this.supabaseKey }, options === null || options === void 0 ? void 0 : options.params) })); } _listenForAuthEvents() { let data = this.auth.onAuthStateChange((event, session) => { this._handleTokenChanged(event, 'CLIENT', session === null || session === void 0 ? void 0 : session.access_token); }); return data; } _handleTokenChanged(event, source, token) { if ((event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN') && this.changedAccessToken !== token) { this.changedAccessToken = token; } else if (event === 'SIGNED_OUT') { this.realtime.setAuth(); if (source == 'STORAGE') this.auth.signOut(); this.changedAccessToken = undefined; } } } exports.default = SupabaseClient; //# sourceMappingURL=SupabaseClient.js.map"
- heading "Stack Trace" [level=2]
- text: "Error: supabaseKey is required. at new SupabaseClient (C:\\Users\\Gutek\\Documents\\10x-cards\\node_modules\\@supabase\\supabase-js\\dist\\main\\SupabaseClient.js:45:19) at createClient (C:\\Users\\Gutek\\Documents\\10x-cards\\node_modules\\@supabase\\supabase-js\\dist\\main\\index.js:38:12) at C:\\Users\\Gutek\\Documents\\10x-cards\\src\\pages\\api\\management-fc.ts:9:18 at async ESModulesEvaluator.runInlinedModule (file:///C:/Users/Gutek/Documents/10x-cards/node_modules/vite/dist/node/module-runner.js:1049:5) at async SSRCompatModuleRunner.directRequest (file:///C:/Users/Gutek/Documents/10x-cards/node_modules/vite/dist/node/module-runner.js:1271:61) at async SSRCompatModuleRunner.directRequest (file:///C:/Users/Gutek/Documents/10x-cards/node_modules/vite/dist/node/chunks/dep-Bid9ssRr.js:30916:23) at async SSRCompatModuleRunner.cachedRequest (file:///C:/Users/Gutek/Documents/10x-cards/node_modules/vite/dist/node/module-runner.js:1167:76) at async SSRCompatModuleRunner.import (file:///C:/Users/Gutek/Documents/10x-cards/node_modules/vite/dist/node/module-runner.js:1104:12) at async instantiateModule (file:///C:/Users/Gutek/Documents/10x-cards/node_modules/vite/dist/node/chunks/dep-Bid9ssRr.js:30873:12) at async DevPipeline.preload (file:///C:/Users/Gutek/Documents/10x-cards/node_modules/astro/dist/vite-plugin-astro-server/pipeline.js:116:33) at async preloadAndSetPrerenderStatus (file:///C:/Users/Gutek/Documents/10x-cards/node_modules/astro/dist/prerender/routing.js:31:32) at async getSortedPreloadedMatches (file:///C:/Users/Gutek/Documents/10x-cards/node_modules/astro/dist/prerender/routing.js:9:11) at async matchRoute (file:///C:/Users/Gutek/Documents/10x-cards/node_modules/astro/dist/vite-plugin-astro-server/route.js:34:28) at async run (file:///C:/Users/Gutek/Documents/10x-cards/node_modules/astro/dist/vite-plugin-astro-server/request.js:38:28) at async runWithErrorHandling (file:///C:/Users/Gutek/Documents/10x-cards/node_modules/astro/dist/vite-plugin-astro-server/controller.js:64:5) at async handleRequest (file:///C:/Users/Gutek/Documents/10x-cards/node_modules/astro/dist/vite-plugin-astro-server/request.js:34:3)"
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 | import type { Page } from '@playwright/test';
   3 | import { AUTH, NOTIFICATIONS } from '../test-selectors';
   4 |
   5 | // Pomocnicza funkcja do logowania
   6 | async function loginUser(page: Page) {
   7 |   await page.goto('/auth/login');
   8 |   await page.getByTestId(AUTH.EMAIL_INPUT).fill('test-e2e@example.com');
   9 |   await page.getByTestId(AUTH.PASSWORD_INPUT).fill('Test123!@#');
  10 |   await page.getByTestId(AUTH.SUBMIT_BUTTON).click();
> 11 |   await expect(page).toHaveURL('/dashboard');
     |                      ^ Error: Timed out 5000ms waiting for expect(locator).toHaveURL(expected)
  12 | }
  13 |
  14 | test.describe('Testy generowania fiszek', () => {
  15 |   test.beforeEach(async ({ page }) => {
  16 |     // Zaloguj użytkownika przed każdym testem
  17 |     await loginUser(page);
  18 |   });
  19 |
  20 |   test('Generowanie fiszek z tekstu źródłowego', async ({ page }) => {
  21 |     // Przejście do strony generowania fiszek
  22 |     await page.goto('/generate');
  23 |     
  24 |     // Przygotowanie tekstu źródłowego (min. 1000 znaków)
  25 |     const sourceText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(25);
  26 |     await page.getByTestId('source-text-input').fill(sourceText);
  27 |     
  28 |     // Wybór modelu AI
  29 |     await page.getByTestId('ai-model-selector').selectOption('llama3.2:3b');
  30 |     
  31 |     // Generowanie fiszek
  32 |     await page.getByTestId('generate-button').click();
  33 |     
  34 |     // Oczekiwanie na wygenerowanie propozycji (z timeoutem)
  35 |     await expect(page.getByTestId('flashcard-proposal')).toBeVisible({ timeout: 30000 });
  36 |     
  37 |     // Zatwierdzenie pierwszych trzech propozycji
  38 |     for (let i = 0; i < 3; i++) {
  39 |       await page.getByTestId('approve-button').nth(i).click();
  40 |     }
  41 |     
  42 |     // Zapisanie zatwierdzonych fiszek
  43 |     await page.getByTestId('save-approved-button').click();
  44 |     await expect(page.getByTestId(NOTIFICATIONS.SUCCESS)).toBeVisible();
  45 |     
  46 |     // Weryfikacja, czy fiszki pojawiły się w sekcji "Moje fiszki"
  47 |     await page.goto('/flashcards');
  48 |     await expect(page.getByTestId('flashcard-item')).toHaveCount(3);
  49 |   });
  50 |
  51 |   test('Anulowanie generowania', async ({ page }) => {
  52 |     // Przejście do strony generowania fiszek
  53 |     await page.goto('/generate');
  54 |     
  55 |     // Wprowadzenie fragmentu tekstu
  56 |     await page.getByTestId('source-text-input').fill('Fragment tekstu');
  57 |     
  58 |     // Kliknięcie przycisku generowania
  59 |     await page.getByTestId('generate-button').click();
  60 |     
  61 |     // Anulowanie procesu
  62 |     await page.getByTestId('cancel-button').click();
  63 |     
  64 |     // Weryfikacja powrotu do stanu początkowego
  65 |     await expect(page.getByTestId('generate-button')).toBeVisible();
  66 |     await expect(page.getByTestId('source-text-input')).toBeEmpty();
  67 |   });
  68 |
  69 |   test('Błąd przy generowaniu - za krótki tekst', async ({ page }) => {
  70 |     // Przejście do strony generowania fiszek
  71 |     await page.goto('/generate');
  72 |     
  73 |     // Wprowadzenie zbyt krótkiego tekstu
  74 |     await page.getByTestId('source-text-input').fill('Za krótki tekst');
  75 |     
  76 |     // Kliknięcie przycisku generowania
  77 |     await page.getByTestId('generate-button').click();
  78 |     
  79 |     // Weryfikacja komunikatu o błędzie
  80 |     await expect(page.getByTestId(NOTIFICATIONS.ERROR)).toBeVisible();
  81 |     await expect(page.getByTestId(NOTIFICATIONS.ERROR)).toContainText('za krótki');
  82 |   });
  83 | }); 
```