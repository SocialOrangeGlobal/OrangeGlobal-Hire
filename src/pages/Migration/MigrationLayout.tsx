import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { navItems } from '../../data';
import { FileText, ArrowRight, PhoneCall, ChevronDown } from 'lucide-react';
import SEO from '../../components/seo/SEO';

export default function MigrationLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const pathParts = location.pathname.split('/').filter(Boolean);
  const categorySlug = pathParts[1]; // e.g., 'skilled-visa'

  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleExpand = (label: string) => {
    setExpandedItems(prev => ({ ...prev, [label]: !prev[label] }));
  };

  // Find the migration nav item
  const migrationMenu = navItems.find(item => item.label === 'Migration');

  // Find the current category based on URL
  const currentCategory = migrationMenu?.children?.find(
    cat => cat.href && cat.href.endsWith(`/${categorySlug}`)
  );

  // Redirect to first child if at category root
  useEffect(() => {
    if (pathParts.length === 2 && currentCategory?.children?.length) {
      // Find the first valid href in the tree
      const firstChild = currentCategory.children[0];
      const targetHref = firstChild.href === '#' && firstChild.children?.length
        ? firstChild.children[0].href
        : firstChild.href;

      if (targetHref && targetHref !== '#') {
        navigate(targetHref, { replace: true });
      }
    }
  }, [location.pathname, currentCategory, navigate, pathParts.length]);

  return (
    <>
      <SEO
        title={`${currentCategory?.label || 'Migration'} | Orange Global`}
        description="Expert Australia visa and immigration support through Orange Global's premium migration services."
      />
      <main className="pt-24 pb-20 lg:pt-32 bg-gray-50/50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col lg:flex-row gap-10">
            {/* Sidebar */}
            <aside className="w-full lg:w-80 shrink-0">
              <div className="sticky top-32 space-y-8">
                {currentCategory && (
                  <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-rh-teal mb-6 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-rh-red/10 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-rh-red" />
                      </div>
                      {currentCategory.label}
                    </h3>
                    <nav className="space-y-1">
                      {currentCategory.children?.map(child => {
                        const isChildActive = location.pathname === child.href;
                        // It is structurally expanded if the URL matches it or any of its sub-items
                        const isStructurallyExpanded =
                          (child.href !== '#' && location.pathname.startsWith(child.href)) ||
                          !!(child.children && child.children.some(sub => location.pathname === sub.href));

                        const isManuallyExpanded = !!expandedItems[child.label];
                        const isExpanded = isStructurallyExpanded || isManuallyExpanded;

                        return (
                          <div key={child.label} className="mb-1 group/sidebar relative">
                            {child.href === '#' ? (
                              <button
                                onClick={() => toggleExpand(child.label)}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-medium text-sm text-left ${isStructurallyExpanded || isManuallyExpanded
                                  ? 'bg-gray-100 text-rh-teal'
                                  : 'text-gray-600 hover:bg-gray-50 hover:text-rh-red'
                                  }`}
                              >
                                <span className="truncate pr-4">{child.label}</span>
                                <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${isExpanded ? 'rotate-180' : 'group-hover/sidebar:rotate-180'}`} />
                              </button>
                            ) : (
                              <Link
                                to={child.href}
                                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all font-medium text-sm ${isChildActive
                                  ? 'bg-rh-teal text-white shadow-md shadow-rh-teal/20'
                                  : isStructurallyExpanded
                                    ? 'bg-gray-100 text-rh-teal'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-rh-red'
                                  }`}
                              >
                                <span className="truncate pr-4">{child.label}</span>
                                {isChildActive && <ArrowRight className="w-4 h-4 shrink-0" />}
                                {!isChildActive && child.children && (
                                  <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${isExpanded ? 'rotate-180' : 'group-hover/sidebar:rotate-180'}`} />
                                )}
                              </Link>
                            )}

                            {/* Nested children (4th level) */}
                            {child.children && (
                              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded
                                ? 'grid grid-rows-[1fr] opacity-100 mt-2'
                                : 'grid grid-rows-[0fr] opacity-0 group-hover/sidebar:grid-rows-[1fr] group-hover/sidebar:opacity-100 group-hover/sidebar:mt-2'
                                }`}>
                                <div className="min-h-0">
                                  <div className="ml-4 pl-3 border-l-2 border-rh-teal/10 flex flex-col gap-1">
                                    {child.children.map(subChild => {
                                      const isSubActive = location.pathname === subChild.href;
                                      return (
                                        <Link
                                          key={subChild.label}
                                          to={subChild.href}
                                          className={`relative flex items-center px-3 py-2 rounded-lg transition-all text-xs font-medium ${isSubActive
                                            ? 'bg-rh-teal/5 text-rh-red'
                                            : 'text-gray-500 hover:text-rh-teal hover:bg-gray-50'
                                            }`}
                                        >
                                          {isSubActive && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-rh-red rounded-r-md" />
                                          )}
                                          <span className={isSubActive ? "ml-1" : ""}>{subChild.label}</span>
                                        </Link>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {/* Persistent Evaluation & Tools Sidebar Links */}
                      <div className="pt-4 mt-4 border-t border-gray-100 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-rh-red px-4 block mb-2">Evaluation & Tools</span>
                        <Link
                          to="/migration/points-calculator"
                          className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all font-medium text-sm ${location.pathname === '/migration/points-calculator'
                            ? 'bg-rh-teal text-white shadow-md shadow-rh-teal/20'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-rh-red'
                            }`}
                        >
                          <span className="truncate pr-4">Points Calculator</span>
                          {location.pathname === '/migration/points-calculator' ? (
                            <ArrowRight className="w-4 h-4 shrink-0" />
                          ) : (
                            <ArrowRight className="w-4 h-4 shrink-0 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </Link>
                      </div>
                    </nav>
                  </div>
                )}
                {/* Consultation Card */}
                <div 
                  onClick={() => navigate('/contact?type=consultation')}
                  className="bg-rh-teal rounded-[2rem] p-8 text-center relative overflow-hidden group cursor-pointer"
                >
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="w-16 h-16 rounded-2xl bg-rh-red/20 flex items-center justify-center mx-auto mb-6 relative z-10">
                    <PhoneCall className="w-8 h-8 text-rh-red" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 relative z-10">Need Expert Advice?</h3>
                  <p className="text-gray-300 text-sm mb-6 relative z-10">
                    Book a consultation with our registered migration agents to discuss your specific situation.
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/contact?type=consultation');
                    }}
                    className="relative z-10 inline-flex items-center justify-center w-full px-6 py-3.5 bg-rh-red text-white font-bold rounded-xl hover:bg-white hover:text-rh-red transition-all shadow-lg shadow-rh-red/20 hover:shadow-xl cursor-pointer"
                  >
                    Book consultation
                  </button>
                </div>
              </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 min-w-0">
              <Outlet />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
