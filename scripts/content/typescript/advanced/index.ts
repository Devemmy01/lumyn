import type { GeneratedCourse } from "@/lib/academy";
import { ACADEMY_WORKSPACE_LAB } from "@/lib/academy";
import { module1 } from "./module-1";
import { module2 } from "./module-2";
import { module3 } from "./module-3";
import { module4 } from "./module-4";
import { module5 } from "./module-5";
import { module6 } from "./module-6";
import { module7 } from "./module-7";

export const typescriptAdvancedCourse: GeneratedCourse = {
  courseTitle: "TypeScript Advanced",
  courseDescription:
    "A hands-on deep dive into advanced TypeScript: generic constraints and generic classes, conditional and mapped types, template literal types, decorators, typed async patterns with Result-style error handling, classic design patterns implemented with real interfaces and generics, and the habits that separate production-quality TypeScript from a first draft, all through short lessons, practical tasks, assessments, and a final capstone project.",
  difficulty: "Advanced",
  modules: [module1, module2, module3, module4, module5, module6, module7],
  finalProject:
    "Build a Typed Plugin & Event System entirely inside the Lumyn Academy workspace: an in-memory plugin architecture with a generic typed event emitter, decorator-based plugin registration, typed async plugin lifecycle hooks using Result-style error handling, and a builder-pattern configuration object that decides which plugins get installed.",
  finalProjectPlan: {
    overview:
      "You'll build a small but complete Plugin & Event System that deliberately combines every major topic from the course. A generic EventEmitter<TEventMap> (built with generics, mapped types, and a template-literal-generated handler binding, from modules 1 through 3) sits at the core. Plugins implement a shared generic Plugin<TEventMap> interface and register themselves through a class decorator (module 4). A PluginManager installs plugins through typed async lifecycle hooks that return a Result-style success or failure outcome instead of throwing (module 5). A fluent PluginSystemConfigBuilder (module 6's builder pattern) assembles the system's configuration, and a small production-quality boundary layer (module 7) safely loads that configuration from an untrusted JSON string using unknown and a real type guard, and reports final plugin status through a separate, internal-detail-free Dto type.",
    labEnvironment: ACADEMY_WORKSPACE_LAB,
    phases: [
      {
        title: "Phase 1: A Generic, Typed Event Emitter",
        instructions:
          "Define type AppEventMap = { userJoined: { userId: number; name: string }; userLeft: { userId: number }; messageSent: { userId: number; text: string } }. Build a generic class EventEmitter<TEventMap extends Record<string, unknown>> with a private handlers store (a Map or plain object keyed by event name, each holding an array of handler functions), an on<K extends keyof TEventMap>(event: K, handler: (payload: TEventMap[K]) => void): void method, an off<K extends keyof TEventMap>(event: K, handler: (payload: TEventMap[K]) => void): void method, and an emit<K extends keyof TEventMap>(event: K, payload: TEventMap[K]): void method that calls every registered handler for that event with the given payload. Then, using a mapped type with key remapping and a template literal type (the pattern from module 3), write type OnHandlers<TEventMap> = { [K in keyof TEventMap as `on${Capitalize<string & K>}`]: (payload: TEventMap[K]) => void } and a bindHandlers(emitter: EventEmitter<TEventMap>, handlers: OnHandlers<TEventMap>): void helper that registers every provided handler on the emitter using emitter.on. Create an EventEmitter<AppEventMap>, register handlers for all three events using bindHandlers, and emit each event once with sample data, confirming every handler fires with a correctly typed payload.",
        evidence: [
          "main.ts containing AppEventMap, the generic EventEmitter<TEventMap> class with on/off/emit, and the OnHandlers<TEventMap> mapped type with bindHandlers",
          "Printed output showing all three AppEventMap events correctly triggering their bound handlers with the right payload data",
        ],
      },
      {
        title: "Phase 2: Decorator-Registered Plugins with Typed Async Lifecycle Hooks",
        instructions:
          "Define type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E }. Define a generic interface Plugin<TEventMap> with a readonly name: string and an async onInstall(bus: EventEmitter<TEventMap>): Promise<Result<void>> method that should register any event handlers the plugin needs and resolve with a success or failure Result rather than throwing. Create a PluginRegistry: Map<string, new () => Plugin<AppEventMap>> and a decorator factory RegisterPlugin(name: string) that registers the decorated class's constructor into PluginRegistry under that name (following the class decorator and decorator factory pattern from module 4). Implement at least two plugin classes decorated with @RegisterPlugin, each implementing Plugin<AppEventMap>: one that logs every userJoined event, and one that deliberately returns a failure Result from onInstall to simulate a plugin that can't start correctly. Write a class PluginManager with an installAll(names: string[], bus: EventEmitter<AppEventMap>): Promise<Map<string, Result<void>>> method that looks up each named plugin in PluginRegistry, constructs it, awaits its onInstall, and collects every plugin's Result keyed by name. Call installAll with both plugin names against your Phase 1 event emitter, then print, for each plugin, whether it installed successfully or what error it returned, using result.ok narrowing rather than try/catch at the call site.",
        evidence: [
          "main.ts containing the Result<T, E> type, the generic Plugin<TEventMap> interface, the RegisterPlugin decorator factory and PluginRegistry, at least two decorated plugin classes, and the PluginManager class",
          "Printed output showing installAll correctly reporting one successful plugin installation and one failed one, both through Result narrowing",
        ],
      },
      {
        title: "Phase 3: A Fluent Config Builder and a Safe Configuration Boundary",
        instructions:
          "Define interface PluginSystemConfig with systemName: string and pluginNames: string[]. Write a fluent PluginSystemConfigBuilder class (following module 6's builder pattern) with setSystemName(name: string): this, addPlugin(name: string): this, and build(): PluginSystemConfig, throwing from build() if systemName was never set. Separately, following module 7's production-quality patterns, write function parseConfig(text: string): unknown wrapping JSON.parse, a type guard isPluginSystemConfig(value: unknown): value is PluginSystemConfig verifying both fields' presence and types, and function loadConfig(text: string): PluginSystemConfig that parses and safely narrows the result, throwing a clear error for invalid input rather than using any type assertion. Also define an internal type PluginStatus (including an internal errorDetail?: string field) and a public PluginStatusDto (without errorDetail), with a mapping function toPluginStatusDto. In a final assembled run, build one PluginSystemConfig with the fluent builder, and separately load a second PluginSystemConfig from a hardcoded JSON string using loadConfig, use one of them to call your Phase 2 PluginManager.installAll against your Phase 1 EventEmitter, map every resulting Result into an internal PluginStatus and then into a PluginStatusDto, and print the final list of PluginStatusDto values, confirming errorDetail never appears in that printed output even for the failed plugin.",
        evidence: [
          "main.ts containing PluginSystemConfigBuilder, parseConfig/isPluginSystemConfig/loadConfig, and the PluginStatus/PluginStatusDto types with a mapping function",
          "Printed output showing a config built with the fluent builder and a second config safely loaded from a JSON string",
          "Printed final PluginStatusDto output for every installed plugin, with internal error detail excluded from what's printed",
        ],
      },
    ],
    deliverables: [
      "main.ts containing the generic EventEmitter<TEventMap> class, the OnHandlers mapped/template-literal type, the Plugin<TEventMap> interface, the RegisterPlugin decorator factory and PluginRegistry, the PluginManager class, the PluginSystemConfigBuilder, and the safe parseConfig/isPluginSystemConfig/loadConfig boundary functions",
      "At least two decorated plugin classes, one succeeding and one failing during installation",
      "Printed output demonstrating event emission, decorator-driven plugin registration, async Result-style install outcomes, a fluent builder result, a safely loaded JSON config, and a final Dto-mapped status report",
      "Short implementation notes explaining how each required feature (generics, conditional/mapped/template literal types, decorators, typed async with Result, the builder pattern, and the unknown-based safety boundary) fits into the system",
    ],
    assessmentCriteria: [
      "EventEmitter<TEventMap> correctly types on, off, and emit using keyof TEventMap and TEventMap[K], and OnHandlers correctly generates handler names with a mapped type and a template literal type",
      "Plugin<TEventMap>, RegisterPlugin, and PluginRegistry correctly use a decorator factory to register plugin classes without manual bookkeeping",
      "PluginManager correctly handles both successful and failed plugin installations using Result-style narrowing rather than uncaught exceptions",
      "PluginSystemConfigBuilder correctly implements the builder pattern, and loadConfig correctly uses unknown and a real type guard instead of any or an unchecked assertion",
      "The final PluginStatusDto output correctly excludes internal-only details while still accurately reporting each plugin's outcome",
    ],
    safetyNotes: "Run only your own practice code inside the Academy workspace, and only read or write files you created yourself as part of this project.",
  },
  progressStructure: [
    "Complete each module's lessons and mark them done",
    "Pass each module's quiz",
    "Submit each module's assignment and mini-project",
    "Complete the final capstone project",
    "Unlock your certificate",
  ],
  certificateEligible: true,
};
