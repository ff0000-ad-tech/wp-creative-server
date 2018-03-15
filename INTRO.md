# Some Reasons

## Banner Production Tech Challenges

Ad Creative are regenerated on a campaign-by-campaign basis. Their characteristics:

* any number of sizes/formats (ex. 970x250 YouTube Masthead, 300x250 DCM Standard, 2x1 IAB Standard)
* a similar "look and feel"
* able to advance their state (data & creative) across all units

#### Code Redundancy

Similarly executing code can be centralized, leaving only functions specific to a particular ad with that unit - the beauty of modularity! But, setups to achieve this are opinionated, with limitations ranging from cognitive overload, to creative restriction, to undue repetition...etc, ad nauseum.

#### Optimization & Performance

Ads must run across all devices, platforms, systems, containers. This is a hostile, untestable, restricted environment in which the unit will need to run, easily, several hundred million impressions (or many times more) over its flight of a couple days (or much longer).

#### Budget & Timing

Despite expectations on par with longer-lived applications, the reality does not afford ROI on campaign-spanning infrastructure.

#### Recycling & Migration

_Can't this all be automated??_ Yes, except for the previous points, plus one destructive edit: The underlying technology (HTML, CSS, Javascript) is evolving daily. This makes for yet more reasonable reluctance on the part of financiers, for the unlikelihood that the investment will live up to its promise by the time it is finished.

## Open Source

The goal of Ad Technology has always been: Get cutting-edge, affordablely produced content in front of consumers that is timely & attractive...and hopefully doesn't make the agency reek of a 3rd world sweat shop.

At [RED Interactive](http://www.ff0000.com/), we've been building the industry's most advanced banners for nearly two decades. We've built a lot of systems to enable that production, and as the times have changed, we've rebuilt those systems several times.

We realized, systems built in isolation, no matter the capabilities, will always be out-paced by global industry. Maintaining a home-grown stack for banner production is an unrecoverable expense for agencies.

At the same time, large-scale software efforts to solve the "banner production problem" have also failed. Again, the tech is changing faster than platforms that take 2 years to develop.

Still, in the trenches, rank-and-file devs continue to make it happen, every day. Banners, banners, and more banners! We engineers of these pipelines revise daily, looking for the "sweet spot" between helpful tools/frameworks and monolithic anchors that prevent us from advancing.

If you're struggling with the same challenges, you are welcome to consider this stack.
