'use client';

import React from 'react';
import styles from './Tabel.module.css';
import Button from './deletButton';
import type { Course, CourseResponse } from '../../../types/course';
import Editbutton from './editbutton';
import { useTranslation } from 'react-i18next';

interface TabelProps {
  data: Course[] | CourseResponse;
  totalPages: number;
  onEdit: (id: number) => void;
  onDelete: (Cs: Course) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Tabel: React.FC<TabelProps> = ({ data, totalPages, onEdit, onDelete, currentPage, onPageChange }) => {
  const { t } = useTranslation();
  const courses: Course[] = Array.isArray(data) ? data : 'courses' in data ? data.courses : [];
  const format = (value: any) => (value !== undefined && value !== null ? value : '');

  if (courses.length === 0) {
    return <div className={styles.empty}>{t('courses.noCoursesFound')}</div>;
  }

  const tableHeaders = [
    t('courses.domain'),
    t('courses.field'),
    t('courses.cycleLevel'),
    t('courses.specialties'),
    t('courses.numSections'),
    t('courses.numGroups'),
    t('courses.semester'),
    t('courses.modules'),
    t('courses.action')
  ];

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className={styles.tabel}>
        <thead>
          <tr className={styles.mainraw}>
            {tableHeaders.map(header => (
              <th key={header} className={styles.headtext}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {courses.map(course => (
            <tr key={String(course.id)} className={styles.lines}>
              <td className={styles.textnormal}>{format(course.domaine)}</td>
              <td className={styles.textnormal}>{format(course['filière'])}</td>
              <td className={styles.textnormal}>{format(course.niveau_cycle)}</td>
              <td className={styles.textnormal}>{format(course['specialités'])}</td>
              <td className={styles.textnormal}>{format(course.nbr_sections)}</td>
              <td className={styles.textnormal}>{format(course.nbr_groupes)}</td>
              <td className={styles.textnormal}>{format(course.semestre)}</td>
              <td className={styles.textnormal}>{format(course.modules)}</td>
              <td className={styles.colomn}>
                <div className={styles.buttonss}>
                  <Editbutton className={styles.actionButton} onClick={() => onEdit(course.id!)}></Editbutton>
                  <Button className={styles.uiverse} onClick={() => onDelete(course)} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    
    </div>
  );
};

export default Tabel;