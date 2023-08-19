import { Fragment } from "react";
import { Pagination as BootPagination } from "react-bootstrap";

interface PaginationProps {
    pageCount: number,
    currentPage: number,
    onPageItemClicked: (page: number) => void,
    className?: string,
}

export default function Pagination({ pageCount, className, currentPage, onPageItemClicked }: PaginationProps) {
    const paginationMaxPage = Math.min(pageCount, Math.max(currentPage + 4, 10));
    const paginationMinPage = Math.max(1, Math.min(currentPage - 5, paginationMaxPage - 9));

    const numberedPageItems: JSX.Element[] = [];

    for (let i = paginationMinPage; i <= paginationMaxPage; i++) {
        let paginationItem: JSX.Element;

        if (i === currentPage) {
            const currentPageItemSizeMdOnly = <BootPagination.Item active className="d-none d-md-block">{i}</BootPagination.Item>
            const currentPageItemSizeSmOnly = <BootPagination.Item active className="d-sm-block d-md-none">Page: {i}</BootPagination.Item>

            paginationItem = <Fragment key={i}>{currentPageItemSizeMdOnly}{currentPageItemSizeSmOnly}</Fragment>
        } else {
            paginationItem = <BootPagination.Item key={i} className="d-none d-md-block" onClick={() => onPageItemClicked(i)}>{i}</BootPagination.Item>
        }

        numberedPageItems.push(paginationItem);
    }

    return (
        <BootPagination className={className}>
            {currentPage > 1 &&
                <>
                    <BootPagination.First onClick={() => onPageItemClicked(1)} />
                    <BootPagination.Prev onClick={() => onPageItemClicked(currentPage - 1)} />
                </>
            }
            {numberedPageItems}
            {currentPage < pageCount &&
                <>
                    <BootPagination.Next onClick={() => onPageItemClicked(currentPage + 1)} />
                    <BootPagination.Last onClick={() => onPageItemClicked(pageCount)} />
                </>

            }
        </BootPagination>
    )
}