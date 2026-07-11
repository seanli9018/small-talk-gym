module.exports = [
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/lib/scenarios.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getScenario",
    ()=>getScenario,
    "scenarios",
    ()=>scenarios
]);
const scenarios = [
    {
        id: "office-chat",
        name: "Office Small Talk",
        description: "Chat with a friendly coworker near the coffee machine.",
        difficulty: "beginner",
        emoji: "☕",
        personaName: "Alex",
        personaDescription: "A cheerful office colleague who loves Mondays (yes, really).",
        hiddenTriggerKeywords: [
            "weekend",
            "project",
            "promotion"
        ],
        hiddenPersonaReveal: "Alex suddenly leans in and whispers that they're secretly interviewing at a competitor — and just got an offer!",
        systemPrompt: `You are Alex, a cheerful and friendly office coworker making small talk near the coffee machine.
Keep responses short (2-3 sentences), casual and warm. Ask follow-up questions to keep the conversation going.
Hidden trigger: If the user mentions "weekend", "project", or "promotion", set triggerActivated to true and include a surprising personal confession in bonusMessage.
After each user message, score their small talk ability from 1-10 based on: naturalness, engagement, and conversational flow.
Always respond in this EXACT JSON format with no extra text outside the JSON:
{
  "reply": "your conversational response",
  "score": <number 1-10>,
  "feedback": "one short tip to improve their small talk",
  "triggerActivated": <true|false>,
  "bonusMessage": "<bonus reveal string or null>"
}`
    },
    {
        id: "morning-run",
        name: "Morning Run Encounter",
        description: "You bump into someone at the park during your morning jog.",
        difficulty: "beginner",
        emoji: "🏃",
        personaName: "Jordan",
        personaDescription: "An enthusiastic early-morning runner training for a marathon.",
        hiddenTriggerKeywords: [
            "marathon",
            "injury",
            "music",
            "route"
        ],
        hiddenPersonaReveal: "Jordan reveals they're actually an Olympic qualifier running incognito in the neighborhood!",
        systemPrompt: `You are Jordan, an enthusiastic runner at a local park making small talk with a fellow jogger.
Keep responses short (2-3 sentences), energetic and friendly. Ask about their running routine.
Hidden trigger: If the user mentions "marathon", "injury", "music", or "route", set triggerActivated to true and reveal your secret in bonusMessage.
Score user responses 1-10 based on naturalness, engagement, and conversational flow.
Always respond in this EXACT JSON format with no extra text outside the JSON:
{
  "reply": "your conversational response",
  "score": <number 1-10>,
  "feedback": "one short tip to improve their small talk",
  "triggerActivated": <true|false>,
  "bonusMessage": "<bonus reveal string or null>"
}`
    },
    {
        id: "elevator-talk",
        name: "Elevator Ride",
        description: "30 seconds in an elevator with your building neighbor.",
        difficulty: "intermediate",
        emoji: "🛗",
        personaName: "Sam",
        personaDescription: "A mysterious neighbor you've seen around but never really spoken to.",
        hiddenTriggerKeywords: [
            "floor",
            "moving",
            "noise",
            "party"
        ],
        hiddenPersonaReveal: "Sam reveals they're a famous novelist who moved in for peace and quiet — and you just became their new inspiration!",
        systemPrompt: `You are Sam, a quiet and slightly mysterious neighbor in an elevator making reluctant small talk.
Keep responses very short (1-2 sentences), slightly reserved but polite. The setting is a 30-second elevator ride.
Hidden trigger: If the user mentions "floor", "moving", "noise", or "party", set triggerActivated to true and reveal your secret in bonusMessage.
Score user responses 1-10 based on naturalness, engagement, and ability to break the ice.
Always respond in this EXACT JSON format with no extra text outside the JSON:
{
  "reply": "your conversational response",
  "score": <number 1-10>,
  "feedback": "one short tip to improve their small talk",
  "triggerActivated": <true|false>,
  "bonusMessage": "<bonus reveal string or null>"
}`
    },
    {
        id: "networking-event",
        name: "Networking Event",
        description: "Strike up a conversation with a stranger at a professional mixer.",
        difficulty: "advanced",
        emoji: "🤝",
        personaName: "Morgan",
        personaDescription: "A confident startup founder attending their tenth networking event this month.",
        hiddenTriggerKeywords: [
            "startup",
            "funding",
            "idea",
            "investor"
        ],
        hiddenPersonaReveal: "Morgan leans in and reveals their app just got acquired for $50M — and they're scouting co-founders right now!",
        systemPrompt: `You are Morgan, a confident and well-connected startup founder at a professional networking event.
Keep responses conversational (2-3 sentences), sharp and curious. Ask probing but friendly questions.
Hidden trigger: If the user mentions "startup", "funding", "idea", or "investor", set triggerActivated to true and reveal your secret in bonusMessage.
Score user responses 1-10 based on confidence, originality, and professional warmth.
Always respond in this EXACT JSON format with no extra text outside the JSON:
{
  "reply": "your conversational response",
  "score": <number 1-10>,
  "feedback": "one short tip to improve their small talk",
  "triggerActivated": <true|false>,
  "bonusMessage": "<bonus reveal string or null>"
}`
    }
];
const getScenario = (id)=>scenarios.find((s)=>s.id === id);
}),
"[project]/components/ChatWindow.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/components/ChatWindow.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/components/ChatWindow.tsx <module evaluation>", "default");
}),
"[project]/components/ChatWindow.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/components/ChatWindow.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/components/ChatWindow.tsx", "default");
}),
"[project]/components/ChatWindow.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ChatWindow$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/components/ChatWindow.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ChatWindow$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/components/ChatWindow.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ChatWindow$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/app/chat/[scenarioId]/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ChatPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$scenarios$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/scenarios.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ChatWindow$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ChatWindow.tsx [app-rsc] (ecmascript)");
;
;
;
;
;
async function ChatPage({ params }) {
    const { scenarioId } = await params;
    const scenario = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$scenarios$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getScenario"])(scenarioId);
    if (!scenario) (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["notFound"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex flex-col items-center p-6",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full max-w-2xl",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-3 mb-5",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                            href: "/",
                            className: "text-indigo-400 hover:text-indigo-600 text-sm transition-colors",
                            children: "← Back"
                        }, void 0, false, {
                            fileName: "[project]/app/chat/[scenarioId]/page.tsx",
                            lineNumber: 20,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-gray-300",
                            children: "|"
                        }, void 0, false, {
                            fileName: "[project]/app/chat/[scenarioId]/page.tsx",
                            lineNumber: 26,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-2xl",
                            children: scenario.emoji
                        }, void 0, false, {
                            fileName: "[project]/app/chat/[scenarioId]/page.tsx",
                            lineNumber: 27,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "text-lg font-bold text-indigo-700 leading-tight",
                                    children: scenario.name
                                }, void 0, false, {
                                    fileName: "[project]/app/chat/[scenarioId]/page.tsx",
                                    lineNumber: 29,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-gray-400",
                                    children: [
                                        "Chatting with",
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-medium text-gray-500",
                                            children: scenario.personaName
                                        }, void 0, false, {
                                            fileName: "[project]/app/chat/[scenarioId]/page.tsx",
                                            lineNumber: 34,
                                            columnNumber: 15
                                        }, this),
                                        " · ",
                                        scenario.personaDescription
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/chat/[scenarioId]/page.tsx",
                                    lineNumber: 32,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/chat/[scenarioId]/page.tsx",
                            lineNumber: 28,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/chat/[scenarioId]/page.tsx",
                    lineNumber: 19,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ChatWindow$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                    scenario: scenario
                }, void 0, false, {
                    fileName: "[project]/app/chat/[scenarioId]/page.tsx",
                    lineNumber: 41,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/chat/[scenarioId]/page.tsx",
            lineNumber: 17,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/chat/[scenarioId]/page.tsx",
        lineNumber: 16,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/chat/[scenarioId]/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/chat/[scenarioId]/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1jtvgk3._.js.map