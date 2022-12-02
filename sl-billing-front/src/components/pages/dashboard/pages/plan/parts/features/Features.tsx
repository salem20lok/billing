import React, { useEffect, useState } from "react";
import { FeatureType } from "../../../../../../../@Types/feature";
import { debounce } from "lodash";
import { getFeaturePagination } from "../../../../../../../actions/feature/action";
import InfiniteScroll from "react-infinite-scroll-component";
import { PlanType } from "../../../../../../../@Types/PlanType";

interface FeaturesPropsInterface {
  query: PlanType;
  handleFeature: Function;
  handleDeleteAllFeature: Function;
}

const Features = (props: FeaturesPropsInterface) => {
  const { query, handleFeature, handleDeleteAllFeature } = props;

  const [queryFeature, setQueryFeature] = useState<{
    skip: number;
    limit: number;
    featureName: string;
  }>({ featureName: "", limit: 8, skip: 0 });

  const [showSelectMulti, setShowSelectMulti] = useState<boolean>(false);

  const [hasMore, setHasMore] = useState<boolean>(true);

  const debounceSearch = debounce((payload: string) => {
    setQueryFeature({ limit: 8, skip: 0, featureName: payload });
    setFeatures([]);
  }, 1000);

  const [features, setFeatures] = useState<FeatureType[]>([]);
  const featurePaginationDebounce = debounce((query) => {
    getFeaturePagination(query, (data) => {
      if (data.count <= features.length + 8) setHasMore(false);
      setFeatures([...features, ...data.features]);
    });
  }, 0);

  const handleFeaturesPagination = () => {
    setQueryFeature({
      ...queryFeature,
      skip: queryFeature.skip + 8,
    });
  };

  useEffect(() => {
    featurePaginationDebounce(queryFeature);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryFeature]);

  return (
    <div className="relative z-0 mb-6 w-full group">
      <button
        id="dropdownSearchButton"
        data-dropdown-toggle="dropdownSearch"
        className="flex justify-between py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        type="button"
        onClick={() => setShowSelectMulti(!showSelectMulti)}
      >
        features
        <svg
          className="ml-2 w-4 h-4"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {showSelectMulti && (
        <>
          <div
            style={{ zIndex: 999 }}
            onClick={() => setShowSelectMulti(false)}
            className="fixed w-full h-full  top-0 left-0 bg-black bg-opacity-0 overflow-y-auto fixed z-30 md:inset-0 h-modal md:h-full"
          />
          <div
            style={{ position: "absolute", zIndex: 1000 }}
            id="dropdownSearch"
            className="w-full  bg-white rounded shadow dark:bg-gray-900 "
          >
            <div className="p-3">
              <label htmlFor="input-group-search" className="sr-only">
                Search
              </label>
              <div className="relative">
                <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  onChange={(e) => {
                    debounceSearch(e.target.value);
                  }}
                  type="text"
                  id="input-group-search"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Search user"
                />
              </div>
            </div>
            <ul
              className="  px-3 pb-3  text-sm text-gray-700 dark:text-gray-200"
              aria-labelledby="dropdownSearchButton"
            >
              <InfiniteScroll
                dataLength={features.length}
                next={() => {
                  handleFeaturesPagination();
                }}
                hasMore={hasMore}
                loader={<h4>Loading...</h4>}
                height={150}
                endMessage={
                  <p className="text-center text-green-500">
                    <b>Yay! You have seen it all</b>
                  </p>
                }
              >
                {features.map((el) => {
                  return (
                    <li key={el._id}>
                      <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                        <input
                          onChange={() => {
                            handleFeature(el._id);
                          }}
                          checked={
                            query.feature && el._id
                              ? query.feature?.includes(el._id)
                              : false
                          }
                          id={el._id}
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                        />
                        <label
                          htmlFor={el._id}
                          className=" flex  ml-2 w-full text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                        >
                          {el.featureName}
                        </label>
                      </div>
                    </li>
                  );
                })}
              </InfiniteScroll>
            </ul>
            <span
              onClick={() => {
                handleDeleteAllFeature();
              }}
              className="flex  cursor-pointer items-center p-3 justify-center text-sm font-medium text-red-600 bg-gray-50 border-t border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-600 dark:text-red-500 "
            >
              <svg
                className="mr-1 w-5 h-5"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M11 6a3 3 0 11-6 0 3 3 0 016 0zM14 17a6 6 0 00-12 0h12zM13 8a1 1 0 100 2h4a1 1 0 100-2h-4z" />
              </svg>
              Delete all user
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default Features;
