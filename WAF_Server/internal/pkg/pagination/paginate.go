package pagination

import (
	"fmt"
	"math"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type Pagination[T any] struct {
	Limit      int    `json:"limit,omitempty"`
	Page       int    `json:"page,omitempty"`
	Sort       string `json:"sort,omitempty"`
	TotalRows  int64  `json:"total_rows"`
	TotalPages int    `json:"total_pages"`
	Records    []T    `json:"records"`
}

func (p *Pagination[T]) GetOffset() int {
	return (p.GetPage() - 1) * p.GetLimit()
}

func (p *Pagination[T]) GetLimit() int {
	if p.Limit == 0 {
		p.Limit = 10
	}
	return p.Limit
}

func (p *Pagination[T]) GetPage() int {
	if p.Page == 0 {
		p.Page = 1
	}
	return p.Page
}

func (p *Pagination[T]) GetSort() string {
	return p.Sort
}

func Paginate[T any](table interface{}, pagination *Pagination[T], db *gorm.DB) func(db *gorm.DB) *gorm.DB {
	var totalRows int64
	db.Model(table).Count(&totalRows)
	fmt.Println("totalRows", totalRows)
	pagination.TotalRows = totalRows
	totalPages := int(math.Ceil(float64(totalRows) / float64(pagination.GetLimit())))
	pagination.TotalPages = totalPages

	return func(db *gorm.DB) *gorm.DB {
		return db.Offset(pagination.GetOffset()).Limit(pagination.GetLimit()).Order(pagination.GetSort())
	}
}

func NewPagination[T any](ctx *gin.Context) *Pagination[T] {
	limitStr := ctx.DefaultQuery("limit", "0") // Sử dụng DefaultQuery để xác định giá trị mặc định
	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit < 0 {
		limit = 10
	}

	pageStr := ctx.DefaultQuery("page", "1")
	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		page = 1
	}

	sort := ctx.Query("sort")

	return &Pagination[T]{
		Limit: limit,
		Page:  page,
		Sort:  sort,
	}
}
