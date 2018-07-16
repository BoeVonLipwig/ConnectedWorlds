import ProjectLayout from "../layouts/ProjectLayout";
import ProgrammeLayout from "../layouts/ProgrammeLayout";
import CollaboratorLayout from "../layouts/CollaboratorLayout";

class LayoutFactory {
  static projectLayout() {
    return ProjectLayout.getLayout();
  }

  static programmeLayout() {
    return ProgrammeLayout.getLayout();
  }

  static collaboratorLayout() {
    return CollaboratorLayout.getLayout();
  }

  static computeLayout(l) {
    switch (l) {
      case "showProjects":
        return this.projectLayout();
      case "showSchools":
        return this.programmeLayout();
      case "showCollab":
        return this.collaboratorLayout();

      default:
        return { name: "grid" };
    }
  }
}

export default LayoutFactory;