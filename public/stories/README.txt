LAWNATQ | Interactive Stories Asset Pack

Contains two bilingual interactive stories:
- 01_School_Day
- 02_Turtle_Adventure

Each story folder contains:
- cover.png
- separate scene/choice/ending PNG images
- story.json with Arabic and English story text, labels, and exact branching links

IMPORTANT IMPLEMENTATION NOTES
1. Use the PNG files as image assets only. No text is embedded in the intended story UI artwork.
2. Render all story titles, descriptions, scene text, and choice labels from story.json.
3. Select the text using the website's current language (ar or en).
4. Use RTL for Arabic and LTR for English.
5. Follow each scene's `next` field and each choice's `next` field exactly.
6. Do not randomize branches or replace the supplied images.
7. The scene and choice images are separate files. Preserve filenames and folder structure.
8. Each story starts at `start_scene`; `cover` is shown before the first scene.
