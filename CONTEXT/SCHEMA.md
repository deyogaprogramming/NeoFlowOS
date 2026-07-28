# Schema Document

## Database Structure (Firestore)

The database follows a hierarchical structure based on user ownership.

### User Sub-collections
Path: `users/{userId}/`

#### Ideas (`ideas/{ideaId}`)
- `id` (string): Unique identifier.
- `title` (string): Idea title.
- `description` (string): Detailed description.
- `mood` (string): Emotional tone.
- `niche` (string): Content niche.
- `platform` (string): Target platform.
- `status` (string): Pipeline status (e.g., 'Ide', 'Terbit').
- `createdAt` (number): Timestamp.
- `userId` (string): Owner ID.

#### Prompts (`prompts/{promptId}`)
- `id` (string): Unique identifier.
- `ideaId` (string, optional): Associated idea.
- `title` (string): Prompt title.
- `layers` (object): Structured prompt layers (scene, subject, camera, lighting, style).
- `preset` (string): Applied preset.
- `createdAt` (number): Timestamp.
- `userId` (string): Owner ID.

#### References (`references/{referenceId}`)
- `id` (string): Unique identifier.
- `title` (string): Reference title.
- `link` (string): URL or source.
- `tags` (array of strings): Associated tags.
- `category` (string): Reference category.
- `notes` (string): Additional notes.
- `createdAt` (number): Timestamp.
- `userId` (string): Owner ID.

#### VisualDNA (`visualDNA/current`)
- `styleRules` (array of strings)
- `emotionalRules` (array of strings)
- `framingRules` (array of strings)
- `colorRules` (array of strings)
- `forbiddenStyles` (array of strings)
- `userId` (string): Owner ID.

#### PromptEvolution (`evolutions/{evolutionId}`)
- Tracks iterations of a prompt (version, evaluation, etc.).

#### MoodboardAnalysis (`moodboardAnalyses/{analysisId}`)
- Stores AI analysis results of uploaded reference images.
