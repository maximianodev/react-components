import React, { useState } from 'react';
import menuData from '../../mock/menuData.json';
import styles from './MenuMobile.module.css';

type MenuItem = {
  id: number;
  slug: string;
  name: string;
  href: string;
  hasChildren: boolean;
  children: MenuItem[];
};

interface SubCategory extends MenuItem {}

interface Category extends MenuItem {
  children: SubCategory[];
}

interface Department extends MenuItem {
  children: Category[];
}

type Categories = {
  categories: Department[];
};

interface MenuMobileProps {
  data: Categories;
}

interface CurrentDataProps {
  categories: MenuItem[];
  title?: string;
  tree: number;
  categoryTree?: string[];
}

export const MenuMobile = ({ data }: MenuMobileProps) => {
  const { categories } = data;

  const initialData = {
    categories,
    tree: 0,
  };

  const [currentData, setCurrentData] = useState<CurrentDataProps>(initialData);

  if (!categories) return <></>;

  function navigateToLink(link: string) {
    window.location.pathname = link;
  }

  function handleClick(category: Category | SubCategory) {
    const categoryTree = category.href.split('/').filter(Boolean);

    if (category.children?.length) {
      setCurrentData({
        categories: category.children,
        title: category.name,
        tree: currentData.tree + 1,
        categoryTree,
      });
    } else {
      navigateToLink(category.href);
    }
  }

  function handleBack() {
    if (currentData?.categoryTree?.length === 1) {
      setCurrentData(initialData);
    }

    if (currentData?.categoryTree?.length === 2) {
      const nameFilter = currentData.categoryTree[0];

      const newDataFiltered = categories.filter(
        category => category.slug === nameFilter
      )[0];

      setCurrentData({
        categories: newDataFiltered.children,
        tree: 1,
        categoryTree: [nameFilter],
        title: newDataFiltered.name
      })
    }
  }

  return (
    <div className={styles.container}>
      {currentData.title && <h2>{currentData.title}</h2>}

      {currentData.tree > 0 && <button onClick={() => handleBack()}>Voltar</button>}

      {currentData.categories.map(category => (
        <div key={category.id} onClick={() => handleClick(category)}>
          {category.name}
        </div>
      ))}
    </div>
  );
};

MenuMobile.defaultProps = menuData;
