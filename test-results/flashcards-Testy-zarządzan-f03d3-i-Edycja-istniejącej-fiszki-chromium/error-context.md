# Test info

- Name: Testy zarządzania fiszkami >> Edycja istniejącej fiszki
- Location: C:\Users\Gutek\Documents\10x-cards\tests\e2e\flashcards.spec.ts:255:3

# Error details

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByTestId('edit-flashcard-button').first()

    at C:\Users\Gutek\Documents\10x-cards\tests\e2e\flashcards.spec.ts:260:61
```

# Page snapshot

```yaml
- navigation:
  - link "10x Cards":
    - /url: /
  - link "Dashboard":
    - /url: /dashboard
  - link "Generuj fiszki":
    - /url: /generate
  - link "Moje fiszki":
    - /url: /flashcards
  - button "test-e2e@example.com":
    - text: test-e2e@example.com
    - img
- main:
  - heading "Moje Fiszki" [level=1]
  - button "Dodaj fiszkę"
  - textbox "Szukaj fiszek..."
  - button "Szukaj"
  - text: Źródło
  - combobox "Źródło":
    - option "Wszystkie" [selected]
    - option "Ręcznie dodane"
    - option "AI (bez zmian)"
    - option "AI (edytowane)"
  - text: Sortowanie
  - combobox "Sortowanie":
    - option "Najnowsze" [selected]
    - option "Najstarsze"
    - option "Alfabetycznie (A-Z)"
    - option "Alfabetycznie (Z-A)"
    - option "Ostatnio aktualizowane"
  - paragraph: Problem z pobieraniem fiszek
  - button "Spróbuj ponownie"
  - heading "Brak fiszek" [level=3]
  - paragraph: Nie znaleziono żadnych fiszek spełniających kryteria.
  - paragraph: Spróbuj zmienić kryteria wyszukiwania lub dodaj nowe fiszki.
- contentinfo:
  - paragraph: © 2025 10x Cards. Wszystkie prawa zastrzeżone.
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
  160 |     if (await magicLinkButton.isVisible().catch(() => false)) {
  161 |       await magicLinkButton.click();
  162 |       console.log('Kliknięto przycisk do wysłania magic linka');
  163 |       
  164 |       // Poczekaj na potwierdzenie wysłania
  165 |       await page.waitForTimeout(2000);
  166 |       
  167 |       // Ponieważ w testach nie możemy kliknąć linka w emailu, dodajemy obejście:
  168 |       // Próbujemy bezpośrednio przejść na dashboard - w testach może to zadziałać
  169 |       await page.goto('/dashboard');
  170 |       
  171 |       if (page.url().includes('/dashboard')) {
  172 |         console.log('Przejście na dashboard po próbie magic link powiodło się');
  173 |         return;
  174 |       }
  175 |     } else {
  176 |       console.log('Przycisk do magic link nie jest widoczny');
  177 |     }
  178 |   } catch (magicLinkError) {
  179 |     console.error('Błąd podczas próby magic link:', magicLinkError);
  180 |   }
  181 |   
  182 |   // Podejście #4 (ostatnia szansa): Sprawdźmy, czy konto testowe istnieje i próbujmy je stworzyć
  183 |   try {
  184 |     console.log('Ostatnia próba - tworzenie testowego konta');
  185 |     await page.goto('/auth/register');
  186 |     
  187 |     // Znajdź elementy formularza
  188 |     const emailInput = await page.getByTestId('auth-email-input');
  189 |     const passwordInput = await page.getByTestId('auth-password-input');
  190 |     const confirmPasswordInput = await page.getByTestId('auth-confirm-password-input');
  191 |     const termsCheckbox = await page.getByTestId('auth-terms-checkbox');
  192 |     const registerButton = await page.getByTestId('auth-submit-button');
  193 |     
  194 |     // Wypełnij formularz
  195 |     await emailInput.fill('test-e2e@example.com');
  196 |     await passwordInput.fill('Test123!@#');
  197 |     await confirmPasswordInput.fill('Test123!@#');
  198 |     await termsCheckbox.check();
  199 |     
  200 |     // Kliknij przycisk rejestracji
  201 |     await Promise.all([
  202 |       page.waitForNavigation({ timeout: 10000 }).catch(() => 
  203 |         console.log('Brak automatycznego przekierowania po rejestracji')),
  204 |       registerButton.click()
  205 |     ]);
  206 |     
  207 |     // Sprawdź czy jesteśmy na dashboardzie
  208 |     if (page.url().includes('/dashboard')) {
  209 |       console.log('Rejestracja i automatyczne logowanie udane');
  210 |       return;
  211 |     }
  212 |     
  213 |     // Sprawdź, czy mamy teraz dane w localStorage
  214 |     const hasAuthDataAfterRegister = await page.evaluate(() => {
  215 |       return localStorage.getItem('userId') !== null && 
  216 |              localStorage.getItem('authSession') !== null;
  217 |     });
  218 |     
  219 |     if (hasAuthDataAfterRegister) {
  220 |       console.log('Dane autoryzacji znalezione po rejestracji - ręcznie przechodzimy na dashboard');
  221 |       await page.goto('/dashboard');
  222 |       return;
  223 |     }
  224 |   } catch (registerError) {
  225 |     console.error('Błąd podczas próby rejestracji testowego konta:', registerError);
  226 |   }
  227 |   
  228 |   // Jeśli dotarliśmy tutaj, to wszystkie metody logowania zawiodły
  229 |   console.error('Wszystkie metody logowania zawiodły - generuję zrzut ekranu dla diagnostyki');
  230 |   await page.screenshot({ path: 'login-failure.png' });
  231 |   throw new Error('Nie udało się zalogować żadną z dostępnych metod');
  232 | }
  233 |
  234 | test.describe('Testy zarządzania fiszkami', () => {
  235 |   test.beforeEach(async ({ page }) => {
  236 |     // Zaloguj użytkownika przed każdym testem
  237 |     await loginUser(page);
  238 |   });
  239 |
  240 |   test('Ręczne tworzenie fiszki', async ({ page }) => {
  241 |     // Przejście do sekcji "Moje fiszki"
  242 |     await page.goto('/flashcards');
  243 |     
  244 |     // Dodawanie nowej fiszki
  245 |     await page.getByTestId('add-flashcard-button').click();
  246 |     await page.getByTestId('flashcard-front-input').fill('Pytanie testowe E2E');
  247 |     await page.getByTestId('flashcard-back-input').fill('Odpowiedź testowa E2E');
  248 |     await page.getByTestId('save-flashcard-button').click();
  249 |     
  250 |     // Weryfikacja dodania fiszki
  251 |     await expect(page.getByTestId(NOTIFICATIONS.SUCCESS)).toBeVisible();
  252 |     await expect(page.getByText('Pytanie testowe E2E')).toBeVisible();
  253 |   });
  254 |
  255 |   test('Edycja istniejącej fiszki', async ({ page }) => {
  256 |     // Przejście do sekcji "Moje fiszki"
  257 |     await page.goto('/flashcards');
  258 |     
  259 |     // Wybór pierwszej fiszki do edycji
> 260 |     await page.getByTestId('edit-flashcard-button').first().click();
      |                                                             ^ Error: locator.click: Test timeout of 30000ms exceeded.
  261 |     
  262 |     // Edycja fiszki
  263 |     await page.getByTestId('flashcard-front-input').fill('Zaktualizowane pytanie E2E');
  264 |     await page.getByTestId('flashcard-back-input').fill('Zaktualizowana odpowiedź E2E');
  265 |     await page.getByTestId('save-flashcard-button').click();
  266 |     
  267 |     // Weryfikacja aktualizacji
  268 |     await expect(page.getByTestId(NOTIFICATIONS.SUCCESS)).toBeVisible();
  269 |     await expect(page.getByText('Zaktualizowane pytanie E2E')).toBeVisible();
  270 |   });
  271 |
  272 |   test('Usuwanie fiszki', async ({ page }) => {
  273 |     // Przejście do sekcji "Moje fiszki"
  274 |     await page.goto('/flashcards');
  275 |     
  276 |     // Zapisanie liczby fiszek przed usunięciem
  277 |     const countBefore = await page.getByTestId('flashcard-item').count();
  278 |     
  279 |     // Usunięcie pierwszej fiszki
  280 |     await page.getByTestId('delete-flashcard-button').first().click();
  281 |     
  282 |     // Potwierdzenie usunięcia w oknie dialogowym
  283 |     await page.getByTestId('confirm-delete-button').click();
  284 |     
  285 |     // Weryfikacja usunięcia
  286 |     await expect(page.getByTestId(NOTIFICATIONS.SUCCESS)).toBeVisible();
  287 |     const countAfter = await page.getByTestId('flashcard-item').count();
  288 |     expect(countAfter).toBe(countBefore - 1);
  289 |   });
  290 | }); 
```