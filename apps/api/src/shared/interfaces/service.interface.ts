import type { FetchResult } from '@/utils/paginate';

/**
 * IService is a generic interface for services in the application.
 * It provides a standard structure for methods related to fetching, creating, updating, and deleting items.
 *
 * @template T - The type of the query object for pagination.
 * @template P - The type of the query pagination object.
 * @template C - The type of the DTO object for creating an item.
 * @template E - The type of the entity object.
 */
export interface IService<T, P, C, E> {
  /**
   * Fetches items with pagination.
   *
   * @param query - The query object for pagination.
   * @param pagination - The pagination object.
   * @returns A promise that resolves to a FetchResult of the entity.
   */
  getItemsByPagination(query?: T, pagination?: P): Promise<FetchResult<E>>;

  /**
   * Fetches a single item by its ID.
   *
   * @param id - The ID of the item.
   * @returns A promise that resolves to the entity.
   */
  getItem(id: number): Promise<E>;

  /**
   * Creates a new item.
   *
   * @param dto - The DTO object for creating the item.
   * @param file - The optional file associated with the item.
   * @returns A promise that resolves to the created entity.
   */
  createItem(dto: C, file?: Express.Multer.File): Promise<E>;

  /**
   * Updates an existing item by its ID.
   *
   * @param id - The ID of the item.
   * @param dto - The DTO object for updating the item.
   * @param file - The optional file associated with the item.
   * @returns A promise that resolves to a boolean indicating whether the update was successful.
   */
  updateItem(id: number, dto: E, file?: Express.Multer.File): Promise<boolean>;

  /**
   * Deletes an existing item by its ID.
   *
   * @param id - The ID of the item.
   * @returns A promise that resolves to a boolean indicating whether the deletion was successful.
   */
  deleteItem(id: number): Promise<boolean>;
}
