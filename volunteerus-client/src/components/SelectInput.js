import { Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'

function SelectInput({ selectedValue, setSelectedValue, options, width }) {
    return (
        <Listbox value={selectedValue} onChange={setSelectedValue} className={width}>
            <div className="relative mt-1">
                <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus:ring-1 focus:ring-pink-400 focus:border-pink-400 sm:text-sm">
                    <span className="block truncate">{selectedValue}</span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <ChevronDownIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
                    </span>
                </Listbox.Button>
                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {options.map((option) => (
                            <Listbox.Option
                                key={option.toString()}
                                className={({ active }) =>
                                    classNames(
                                        active ? 'text-white bg-pink-400' : 'text-gray-900',
                                        'cursor-default select-none relative py-2 pl-10 pr-4'
                                    )
                                }
                                value={option.toString()}
                            >
                                {({ selected, active }) => (
                                    <>
                                        <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                                            {option.toString()}
                                        </span>
                                        {selected ? (
                                            <span className={classNames(active ? 'text-white' : 'text-pink-400', 'absolute inset-y-0 left-0 flex items-center pl-3')}>
                                                <CheckIcon className="w-5 h-5" aria-hidden="true" />
                                            </span>
                                        ) : null}
                                    </>
                                )}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </Transition>
            </div>
        </Listbox>
    )
}

export default SelectInput;