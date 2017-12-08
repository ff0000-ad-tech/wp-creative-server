##### RED Interactive Agency - Ad Technology

Webpack - Creative Server
===============

Ad Creative are generated on a campaign-by-campaign basis. Their characteristics:
 - any number of sizes/formats (ex. 970x250 YouTube Masthead, 300x250 DCM Standard, 2x1 IAB Standard)
 - a similar "look and feel"
 - able to advance their state (data & creative) across all units
 
## Banner Production, Tech Challenges
#### Code Redundancy
Similarly executing code can be centralized, leaving only functions specific to a particular ad with that unit - the beauty of modularity! But the setup to achieve this are opinionated, ranging from cognitive overload to creative restriction to undue repetition.

#### Optimization & Performance
Ads run across all devices, platforms, systems, containers. This is a hostile, untestable, restricted environment in which the unit will need to run, easily, several hundred million impressions over its flight of a couple days.

#### Budget & Timing
Despite expectations on par with longer-lived applications, the reality does not afford ROI on campaign-spanning infrastructure.

#### Recycling & Migration
_Can't this all be automated??_ Yes, except for the previous points, plus one destructive edit: The underlying technology (HTML, CSS, Javascript) is evolving daily.

