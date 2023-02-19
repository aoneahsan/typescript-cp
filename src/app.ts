import { ProjectInput } from './components/project-input';
import { ProjectList } from './components/project-list';
import { EProjectStatus } from './utils/enums';

// --------------------------------------------------------------------------------------------
// ------------------------------------------ OBJECTS -----------------------------------------
// --------------------------------------------------------------------------------------------
new ProjectInput('project-input', 'app');
new ProjectList('project-list', 'app', EProjectStatus.active);
new ProjectList('project-list', 'app', EProjectStatus.finished);
