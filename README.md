This is an older, unfinished version of my [Catan Companion](https://github.com/CK6853/CatanCompanion). 

I don't really feel comfortable uploading an unfinished project that I'm not likely to work on again (at least for a while), but apparently this is one of the few times I've made a full-stack web app that I can post publicly without violating some kind of confidentiality agreement or copyright (probably - it still contains images from the official Catan board game that might technically not be ok 😅). 

The original plan for the Catan Companion was to completely virtualise resource cards, and any game actions associated with them. Resource gathering, robber discards, player trading, and spending would all be handled by users' mobile devices, with one extra to be used as the "Banker". Each of these would be using a React frontend to interact with an Express backend and associated database. 

This would have been cool, but...
1. I don't like the aesthetic of everyone using their phones to play a board game, and I think my family (who this whole project is for) would have been on the same page here
2. Complex implementation, more prone to failure
3. Can't be used by more than one game at once
4. Complete overkill for the actual issue we had - resource gathering taking too long
5. Didn't plan for game expansions at all - e.g. roling a 7 in Seafarer's might only move the pirate ship, not the robber

I might come back and finish it eventually, but with my newer app there's not much point beyond my own frustration at leaving a project unifinished. But it does show some of my work in Express, so it's here as an example. 