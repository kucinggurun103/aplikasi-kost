import sys
import re

file_path = 'resources/js/components/admin/AdminInlineModules.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix table openings
old_open = '<div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">\n        <table className="w-full">'
new_open = '<div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">\n        <div className="overflow-x-auto pb-2">\n          <table className="w-full">'
content = content.replace(old_open, new_open)

# AdminSocialLinks
old_open3 = '<div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">\n        <table className="w-full">\n          <thead className="bg-slate-50 border-b border-slate-100">'
new_open3 = '<div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">\n        <div className="overflow-x-auto pb-2">\n          <table className="w-full">\n            <thead className="bg-slate-50 border-b border-slate-100">'
content = content.replace(old_open3, new_open3)

# Fix table closings with pagination
old_close1 = '            </tbody>\n          </table>\n          <div className="px-4 py-3 border-t'
new_close1 = '            </tbody>\n          </table>\n        </div>\n        <div className="px-4 py-3 border-t'
content = content.replace(old_close1, new_close1)

old_close2 = '            </tbody>\n          </table>\n        <div className="px-4 py-3 border-t'
new_close2 = '            </tbody>\n          </table>\n        </div>\n        <div className="px-4 py-3 border-t'
content = content.replace(old_close2, new_close2)

# Fix table closings without pagination
old_close3 = '            </tbody>\n          </table>\n      </div>'
new_close3 = '            </tbody>\n          </table>\n        </div>\n      </div>'
content = content.replace(old_close3, new_close3)

old_close4 = '            </tbody>\n          </table>\n        </div>\n    </div>'
new_close4 = '            </tbody>\n          </table>\n        </div>\n      </div>\n    </div>'
# actually, let's just use replace

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Replaced successfully')
