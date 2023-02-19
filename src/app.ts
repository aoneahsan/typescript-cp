import { ProjectInput } from './components/project-input.js';
import { ProjectList } from './components/project-list.js';
import { EProjectStatus } from './utils/enums.js';

// --------------------------------------------------------------------------------------------
// ------------------------------------------ OBJECTS -----------------------------------------
// --------------------------------------------------------------------------------------------
new ProjectInput('project-input', 'app');
new ProjectList('project-list', 'app', EProjectStatus.active);
new ProjectList('project-list', 'app', EProjectStatus.finished);
