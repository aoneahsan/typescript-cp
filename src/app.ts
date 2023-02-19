/// <reference path="./components/project-input.ts" />
/// <reference path="./components/project-list.ts" />
/// <reference path="./utils/enums.ts" />

namespace App {
	// --------------------------------------------------------------------------------------------
	// ------------------------------------------ OBJECTS -----------------------------------------
	// --------------------------------------------------------------------------------------------
	new ProjectInput('project-input', 'app');
	new ProjectList('project-list', 'app', EProjectStatus.active);
	new ProjectList('project-list', 'app', EProjectStatus.finished);
}
