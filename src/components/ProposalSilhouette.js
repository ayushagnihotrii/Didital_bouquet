'use client';

export default function ProposalSilhouette() {
    return (
        <div className="fixed inset-0 pointer-events-none z-[2] flex items-end justify-center overflow-hidden" aria-hidden="true">
            <svg
                viewBox="0 0 600 500"
                className="w-[90vw] max-w-[700px] opacity-[0.07]"
                style={{ marginBottom: '-2%' }}
                fill="currentColor"
            >
                {/* Boy kneeling — simplified silhouette */}
                <g fill="#8b1a3a">
                    {/* Boy head */}
                    <circle cx="210" cy="200" r="28" />
                    {/* Boy body/torso — kneeling */}
                    <path d="
            M195,228 C190,240 188,260 192,280
            L185,330 C183,345 188,355 195,360
            L215,360 C220,355 222,345 220,330
            L225,280 C228,260 228,240 225,228 Z
          " />
                    {/* Boy kneeling right leg */}
                    <path d="
            M195,355 C185,370 175,390 170,420
            C168,435 172,445 180,448
            L200,448 C205,445 206,435 204,425
            L205,380 C208,370 205,360 200,355 Z
          " />
                    {/* Boy left leg (back, bent under) */}
                    <path d="
            M218,355 C225,368 235,380 248,390
            C255,395 260,400 258,410
            L255,430 C250,440 240,445 230,442
            C220,435 222,420 225,408
            L220,380 C218,370 216,360 218,355 Z
          " />
                    {/* Boy left arm reaching up with ring box */}
                    <path d="
            M225,240 C240,235 255,225 265,215
            C270,210 275,208 278,210
            L285,218 C282,225 275,230 268,232
            L240,250 C232,252 228,248 225,240 Z
          " />
                    {/* Ring box */}
                    <rect x="273" y="202" width="16" height="14" rx="2" />
                    {/* Small diamond/ring sparkle */}
                    <circle cx="281" cy="198" r="4" fill="#d4618c" />
                    {/* Boy right arm */}
                    <path d="
            M192,240 C180,250 170,260 165,275
            C162,282 165,286 170,285
            L185,275 C190,265 192,255 192,240 Z
          " />
                </g>

                {/* Girl standing — simplified silhouette */}
                <g fill="#8b1a3a">
                    {/* Girl head */}
                    <circle cx="370" cy="140" r="30" />
                    {/* Girl hair flowing */}
                    <path d="
            M345,125 C340,110 342,100 355,95
            C365,92 380,92 390,100
            C398,108 400,120 398,135
            C405,130 410,140 408,155
            C406,165 400,170 395,165
            C400,155 398,145 395,140
            L345,140 C342,135 340,130 345,125 Z
          " />
                    {/* Girl body/dress */}
                    <path d="
            M352,170 C348,185 345,200 343,220
            C340,250 335,290 328,340
            C325,360 322,380 318,400
            C316,415 320,430 330,440
            L340,448 L370,448 L408,448 L418,440
            C425,430 428,415 425,400
            C420,380 415,360 412,340
            C405,290 400,250 398,220
            C396,200 394,185 390,170 Z
          " />
                    {/* Girl left arm (hands clasped surprised) */}
                    <path d="
            M352,180 C340,190 330,200 325,210
            C322,215 325,220 330,218
            C335,215 340,210 345,205
            L355,195 Z
          " />
                    {/* Girl right arm */}
                    <path d="
            M390,180 C400,188 408,195 412,205
            C414,210 412,215 408,213
            C403,210 398,203 393,198
            L388,192 Z
          " />
                    {/* Girl hands clasped near face */}
                    <path d="
            M330,210 C328,215 332,222 340,220
            C345,218 348,215 345,210 Z
          " />
                </g>

                {/* Ground line */}
                <ellipse cx="300" cy="456" rx="200" ry="8" fill="#8b1a3a" opacity="0.3" />

                {/* Floating hearts */}
                <g fill="#d4618c" opacity="0.6">
                    <path d="M300,160 C300,155 295,150 290,150 C283,150 278,157 278,163 C278,175 300,190 300,190 C300,190 322,175 322,163 C322,157 317,150 310,150 C305,150 300,155 300,160Z" transform="scale(0.5) translate(360, 100)" />
                    <path d="M300,160 C300,155 295,150 290,150 C283,150 278,157 278,163 C278,175 300,190 300,190 C300,190 322,175 322,163 C322,157 317,150 310,150 C305,150 300,155 300,160Z" transform="scale(0.35) translate(750, 200)" />
                    <path d="M300,160 C300,155 295,150 290,150 C283,150 278,157 278,163 C278,175 300,190 300,190 C300,190 322,175 322,163 C322,157 317,150 310,150 C305,150 300,155 300,160Z" transform="scale(0.4) translate(200, 250)" />
                </g>
            </svg>
        </div>
    );
}
