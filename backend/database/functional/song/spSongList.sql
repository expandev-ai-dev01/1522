/**
 * @summary
 * Lists all songs for an account with optional filtering by category, artist, or search term.
 * Returns songs ordered by title.
 *
 * @procedure spSongList
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - GET /api/v1/internal/song
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy
 *
 * @param {NVARCHAR(50)} category
 *   - Required: No
 *   - Description: Filter by category
 *
 * @param {NVARCHAR(200)} artist
 *   - Required: No
 *   - Description: Filter by artist
 *
 * @param {NVARCHAR(200)} searchTerm
 *   - Required: No
 *   - Description: Search in title, artist, or lyrics
 *
 * @testScenarios
 * - List all songs for account
 * - Filter by category
 * - Filter by artist
 * - Search by term in title/artist/lyrics
 * - Combined filters
 * - Empty result set
 */
CREATE OR ALTER PROCEDURE [functional].[spSongList]
  @idAccount INTEGER,
  @category NVARCHAR(50) = NULL,
  @artist NVARCHAR(200) = NULL,
  @searchTerm NVARCHAR(200) = NULL
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Required parameter validation
   * @throw {parameterRequired}
   */
  IF @idAccount IS NULL
  BEGIN
    ;THROW 51000, 'idAccountRequired', 1;
  END;

  /**
   * @validation Account existence validation
   * @throw {accountDoesntExist}
   */
  IF NOT EXISTS (
    SELECT *
    FROM [subscription].[account] acc
    WHERE acc.[idAccount] = @idAccount
      AND acc.[deleted] = 0
  )
  BEGIN
    ;THROW 51000, 'accountDoesntExist', 1;
  END;

  /**
   * @rule {db-multi-tenancy-pattern} Account-based filtering
   * @rule {db-soft-delete-pattern} Filter deleted records
   */
  /**
   * @output {SongList, n, n}
   * @column {INT} idSong
   * - Description: Song identifier
   * @column {NVARCHAR(200)} title
   * - Description: Song title
   * @column {NVARCHAR(200)} artist
   * - Description: Artist name
   * @column {NVARCHAR(10)} originalKey
   * - Description: Original musical key
   * @column {NVARCHAR(50)} category
   * - Description: Musical category
   * @column {DATETIME2} dateCreated
   * - Description: Creation timestamp
   * @column {DATETIME2} dateModified
   * - Description: Last modification timestamp
   */
  SELECT
    sng.[idSong],
    sng.[title],
    sng.[artist],
    sng.[originalKey],
    sng.[category],
    sng.[dateCreated],
    sng.[dateModified]
  FROM [functional].[song] sng
  WHERE sng.[idAccount] = @idAccount
    AND sng.[deleted] = 0
    AND (@category IS NULL OR sng.[category] = @category)
    AND (@artist IS NULL OR sng.[artist] = @artist)
    AND (
      @searchTerm IS NULL
      OR sng.[title] LIKE '%' + @searchTerm + '%'
      OR sng.[artist] LIKE '%' + @searchTerm + '%'
      OR sng.[lyrics] LIKE '%' + @searchTerm + '%'
    )
  ORDER BY sng.[title];
END;
GO