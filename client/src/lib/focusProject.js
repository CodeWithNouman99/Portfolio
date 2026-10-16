// Scrolls to a project row in the Projects section (resetting its filter and flashing the row).
// On another route (e.g. a case study) it navigates home with a hash Home.jsx scrolls to.
// navigate: react-router's navigate function.
export function focusProject(id, navigate) {
  // setTimeout: let a closing chat/modal release its scroll lock first
  setTimeout(() => {
    if (document.getElementById('projects')) {
      window.dispatchEvent(new CustomEvent('project:focus', { detail: id }))
    } else {
      navigate(`/#project-${id}`)
    }
  }, 0)
}
