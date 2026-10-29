import React, { useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronDown, FolderOpen } from 'lucide-react';
import { Project } from '../../types/project.ts';
import './ProjectSwitcher.css';

interface ProjectSwitcherProps {
  project: Project;
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

export function ProjectSwitcher({ project, projects, onSelectProject }: ProjectSwitcherProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    optionRefs.current[Math.max(0, projects.findIndex((item) => item.id === project.id))]?.focus();
    const outside = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, [open, project.id, projects]);

  return (
    <div ref={rootRef} className="project-switcher" onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
    }} onKeyDown={(event) => {
      if (event.key === 'Escape' && open) {
        event.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
      }
    }}>
      <span id={`${id}-label`} className="project-switcher__label">Project workspace</span>
      <button
        ref={triggerRef}
        type="button"
        className="project-switcher__trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? `${id}-list` : undefined}
        aria-labelledby={`${id}-label ${id}-value`}
        onClick={() => setOpen(!open)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            setOpen(true);
          }
        }}
      >
        <span className="project-switcher__icon"><FolderOpen size={20} aria-hidden="true" /></span>
        <span id={`${id}-value`} className="project-switcher__identity">
          <span className="project-switcher__id">{project.id}</span>
          <span className="project-switcher__name">{project.clientName}</span>
        </span>
        <ChevronDown size={17} className="project-switcher__chevron" aria-hidden="true" />
      </button>
      {open && (
        <div className="project-switcher__panel">
          <div className="project-switcher__caption">Switch project <span>{projects.length} projects</span></div>
          <div id={`${id}-list`} role="listbox" aria-labelledby={`${id}-label`} className="project-switcher__options">
            {projects.map((item, index) => (
              <button
                key={item.id}
                ref={(element) => { optionRefs.current[index] = element; }}
                type="button"
                role="option"
                aria-selected={item.id === project.id}
                className="project-switcher__option"
                onKeyDown={(event) => {
                  let next = index;
                  if (event.key === 'ArrowDown') next = (index + 1) % projects.length;
                  else if (event.key === 'ArrowUp') next = (index - 1 + projects.length) % projects.length;
                  else if (event.key === 'Home') next = 0;
                  else if (event.key === 'End') next = projects.length - 1;
                  else return;
                  event.preventDefault();
                  optionRefs.current[next]?.focus();
                }}
                onClick={() => {
                  setOpen(false);
                  triggerRef.current?.focus();
                  if (item.id !== project.id) onSelectProject(item);
                }}
              >
                <span className="project-switcher__identity">
                  <span className="project-switcher__id">{item.id} · {item.eventDate}</span>
                  <span className="project-switcher__name">{item.clientName}</span>
                </span>
                {item.id === project.id && <Check size={18} className="project-switcher__check" aria-hidden="true" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
