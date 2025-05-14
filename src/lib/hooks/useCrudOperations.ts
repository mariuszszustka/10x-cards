import { useState, useCallback } from 'react';

interface CrudOperationsOptions<T, CreateData, UpdateData> {
  fetchEndpoint: string;
  createEndpoint?: string;
  updateEndpoint?: string;
  deleteEndpoint?: string;
  defaultQueryParams?: Record<string, any>;
  getItemId: (item: T) => string | number;
  onFetchSuccess?: (data: { items: T[], pagination: any }) => void;
  onFetchError?: (error: Error) => void;
  onCreateSuccess?: (data: T) => void;
  onCreateError?: (error: Error) => void;
  onUpdateSuccess?: (data: T) => void;
  onUpdateError?: (error: Error) => void;
  onDeleteSuccess?: (id: string | number) => void;
  onDeleteError?: (error: Error) => void;
}

export function useCrudOperations<T, CreateData = Partial<T>, UpdateData = Partial<T>>({
  fetchEndpoint,
  createEndpoint = fetchEndpoint,
  updateEndpoint = fetchEndpoint,
  deleteEndpoint = fetchEndpoint,
  defaultQueryParams = {},
  getItemId,
  onFetchSuccess,
  onFetchError,
  onCreateSuccess,
  onCreateError,
  onUpdateSuccess,
  onUpdateError,
  onDeleteSuccess,
  onDeleteError
}: CrudOperationsOptions<T, CreateData, UpdateData>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 20,
    total_items: 0,
    total_pages: 1
  });
  const [queryParams, setQueryParams] = useState({
    ...defaultQueryParams
  });

  // Pobieranie danych
  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const queryString = new URLSearchParams();
      
      // Dodaj wszystkie parametry zapytania
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryString.append(key, String(value));
        }
      });
      
      const response = await fetch(`${fetchEndpoint}?${queryString.toString()}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Wystąpił błąd podczas pobierania danych');
      }
      
      const data = await response.json();
      
      setItems(data.items || data.data || []);
      
      if (data.pagination) {
        setPagination(data.pagination);
      }
      
      if (onFetchSuccess) {
        onFetchSuccess({
          items: data.items || data.data || [],
          pagination: data.pagination || pagination
        });
      }
      
    } catch (error) {
      console.error('Error fetching items:', error);
      setError(error instanceof Error ? error.message : 'Wystąpił nieznany błąd');
      
      if (onFetchError && error instanceof Error) {
        onFetchError(error);
      }
    } finally {
      setLoading(false);
    }
  }, [fetchEndpoint, queryParams, onFetchSuccess, onFetchError, pagination]);

  // Tworzenie nowego elementu
  const createItem = useCallback(async (data: CreateData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(createEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Wystąpił błąd podczas tworzenia');
      }
      
      const createdItem = await response.json();
      
      setItems(prev => [...prev, createdItem]);
      
      if (onCreateSuccess) {
        onCreateSuccess(createdItem);
      }
      
      return createdItem;
    } catch (error) {
      console.error('Error creating item:', error);
      setError(error instanceof Error ? error.message : 'Wystąpił nieznany błąd');
      
      if (onCreateError && error instanceof Error) {
        onCreateError(error);
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  }, [createEndpoint, onCreateSuccess, onCreateError]);

  // Aktualizacja elementu
  const updateItem = useCallback(async (id: string | number, data: UpdateData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${updateEndpoint}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Wystąpił błąd podczas aktualizacji');
      }
      
      const updatedItem = await response.json();
      
      setItems(prev => prev.map(item => 
        getItemId(item) === id ? updatedItem : item
      ));
      
      if (onUpdateSuccess) {
        onUpdateSuccess(updatedItem);
      }
      
      return updatedItem;
    } catch (error) {
      console.error('Error updating item:', error);
      setError(error instanceof Error ? error.message : 'Wystąpił nieznany błąd');
      
      if (onUpdateError && error instanceof Error) {
        onUpdateError(error);
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  }, [updateEndpoint, getItemId, onUpdateSuccess, onUpdateError]);

  // Usuwanie elementu
  const deleteItem = useCallback(async (id: string | number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${deleteEndpoint}/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Wystąpił błąd podczas usuwania');
      }
      
      setItems(prev => prev.filter(item => getItemId(item) !== id));
      
      if (onDeleteSuccess) {
        onDeleteSuccess(id);
      }
      
      return id;
    } catch (error) {
      console.error('Error deleting item:', error);
      setError(error instanceof Error ? error.message : 'Wystąpił nieznany błąd');
      
      if (onDeleteError && error instanceof Error) {
        onDeleteError(error);
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  }, [deleteEndpoint, getItemId, onDeleteSuccess, onDeleteError]);

  // Ustawienie parametrów zapytania
  const setParams = useCallback((params: Record<string, any>) => {
    setQueryParams(prev => ({
      ...prev,
      ...params
    }));
  }, []);

  // Ustawienie strony
  const setPage = useCallback((page: number) => {
    setParams({ page });
  }, [setParams]);

  // Ustawienie wyszukiwania
  const setSearch = useCallback((search: string) => {
    setParams({ search, page: 1 });
  }, [setParams]);

  // Ustawienie filtru
  const setFilter = useCallback((filter: Record<string, any>) => {
    setParams({ ...filter, page: 1 });
  }, [setParams]);

  // Ustawienie sortowania
  const setSort = useCallback((sortParams: { field: string, direction: 'asc' | 'desc' }) => {
    setParams({
      sort_by: sortParams.field,
      sort_dir: sortParams.direction,
      page: 1
    });
  }, [setParams]);

  return {
    items,
    loading,
    error,
    pagination,
    params: queryParams,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
    setPage,
    setSearch,
    setFilter,
    setSort,
    setParams
  };
} 